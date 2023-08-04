import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import { logMessage } from "@/utils/helpers";

const storage = new Storage();
const bucketName = process.env.GOOGLE_BUCKET_NAME as string;

// 👇️ persist uploaded file to GCS bucket
async function uploadFileToStorage(
  fileBuffer: Buffer,
  destinationFileName: string,
  options: any
): Promise<void> {
  const bucket = storage.bucket(bucketName);
  const fileToUpload = bucket.file(destinationFileName);
  const readStream = new Readable();
  readStream._read = () => {};
  readStream.push(fileBuffer);
  readStream.push(null);
  try {
    await new Promise<void>((resolve, reject) => {
      const writeStream = fileToUpload.createWriteStream(options);

      writeStream.on("error", (error) => {
        reject(error);
      });

      writeStream.on("finish", () => {
        resolve();
      });

      readStream.pipe(writeStream);
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        (error.hasOwnProperty("code") && (error as any).code === 401) ||
        (error as any).code === 403
      ) {
        // 👇️ authentication error occurred
        console.error("Authentication error:", error);
      } else {
        // 👇️ other types of errors
        console.error("Error during file upload:", error);
      }
    } else {
      console.error("Error during file upload:", error);
    }
    // 👇️ re-throw the error to propagate it further
    throw error;
  }
}

// 👇️ process request's formdata file to GCP
export default async function handler(request: NextRequest) {
  let message = "Uploading file...";
  let success = true;
  if (request.body) {
    // 👇️ get file from request formdata
    const formData = await request.formData();
    const uploadedFile = formData.get("uploadedFile") as Blob;
    if (uploadedFile) {
      // 👇️ check file type
      const fileType = uploadedFile.type;
      let isValidFileType = false;
      console.log(fileType);
      switch (fileType) {
        case "application/json":
        case "application/vnd.ms-excel":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/xml":
        case "text/csv":
        case "text/xml":
          // 👍 yes
          isValidFileType = true;
          break;
        default:
          // 👎 no
          success = false;
          break;
      }
      if (isValidFileType) {
        // 👇️ binary data operations
        const fileBuffer = await uploadedFile.arrayBuffer();
        const destinationFileName = uploadedFile.name;
        const userName = formData.get("userName");
        try {
          // 👇️ bucket file configurations
          const options = {
            resumable: true,
            gzip: true,
            contentType: fileType,
            metadata: {
              metadata: {
                userName: userName,
              },
            },
          };
          // 👇️ persist uploaded file to GCS bucket
          await uploadFileToStorage(
            Buffer.from(fileBuffer),
            destinationFileName,
            options
          );
          message = "File uploaded successfully";
        } catch (err) {
          message = "Failed to upload file. " + err;
          success = false;
        }
      } else {
        message = "unsupported";
        success = false;
      }
    } else {
      message = "Error: invalid file data";
      success = false;
    }
  } else {
    message = "Error: missing request body";
    success = false;
  }

  if (!success) {
    // 👇️ write the error to the file
    logMessage(message);
  }

  // 👇️ return response
  return new NextResponse(message, {
    status: success ? 200 : 500,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
