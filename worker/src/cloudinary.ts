// worker/src/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  filePath: string,
  folder: string,
  resourceType: "video" | "image"
): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType === "video" ? "video" : "image",
    overwrite: true,
  });
  return result.secure_url;
}
