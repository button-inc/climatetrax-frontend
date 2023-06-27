import { NextRequest } from "next/server";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import { logMessage } from "@/utils/helpers";

const storage = new Storage();
const bucketName = process.env.GOOGLE_BUCKET_NAME as string;

// 👇️ persist uploaded file to GCS bucket
async function uploadFileToStorage(
  fileBuffer: Buffer,
  destinationFileName: string
): Promise<void> {
  const bucket = storage.bucket(bucketName);
  const fileToUpload = bucket.file(destinationFileName);

  const readStream = new Readable();
  readStream._read = () => {}; // Required for Readable stream

  readStream.push(fileBuffer);
  readStream.push(null);

  await new Promise<void>((resolve, reject) => {
    const writeStream = fileToUpload.createWriteStream({
      resumable: true,
      gzip: false,
    });

    writeStream.on("error", (error) => {
      reject(error);
    });

    writeStream.on("finish", () => {
      resolve(); // Pass the value argument if needed: resolve(undefined);
    });

    readStream.pipe(writeStream);
  });
}

// 👇️ process request's formdata file to GCP
export default async function handler(request: NextRequest) {
  let message = "Uploading file...";
  let success = true;

  if (request.body) {
    const formData = await request.formData();
    const file = formData.get("uploadedFile");

    if (file instanceof File) {
      const fileBuffer = await file.arrayBuffer();
      const destinationFileName = file.name;
      try {
        // 👇️ persist uploaded file to GCS bucket
        await uploadFileToStorage(Buffer.from(fileBuffer), destinationFileName);
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
  return new Response(message, {
    status: success ? 200 : 500,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
