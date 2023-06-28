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
        // Authentication error occurred
        console.error("Authentication error:", error);
        // Perform specific error handling for authentication errors
      } else {
        // Other types of errors
        console.error("Error during file upload:", error);
        // Perform general error handling
      }
    } else {
      console.error("Error during file upload:", error);
      // Perform general error handling for unknown errors
    }
    throw error; // Re-throw the error to propagate it further if needed
  }
}

// 👇️ process request's formdata file to GCP
export default async function handler(request: NextRequest) {
  let message = "Uploading file...";
  let success = true;

  // 👇️ get file from request formdata
  if (request.body) {
    const formData = await request.formData();
    const uploadedFile = formData.get("uploadedFile");

    if (uploadedFile && uploadedFile instanceof Blob) {
      const fileBuffer = await uploadedFile.arrayBuffer();
      const destinationFileName = uploadedFile.name;
      try {
        // 👇️ bucket file configurations
        const options = {
          resumable: true,
          gzip: true,
          contentType: uploadedFile.type,
          metadata: {
            customMetadata: {
              key1: "value1",
              key2: "value2",
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
      message = "Error: invalid file";
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
