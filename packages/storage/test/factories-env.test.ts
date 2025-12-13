import { beforeEach, describe, expect, it } from "vitest";

import { createS3 } from "../src/s3";
import { createCloudinary } from "../src/cloudinary";
import { ENV_VARS } from "../src/config";

describe("Factories via env", () => {
  beforeEach(() => {
    const keys = Object.values(ENV_VARS) as string[];
    keys.forEach((k) => delete (process.env as any)[k]);
  });

  it("createS3 loads config from env", () => {
    process.env.PELATFORM_S3_PROVIDER = "aws";
    process.env.PELATFORM_S3_REGION = "us-east-1";
    process.env.PELATFORM_S3_BUCKET = "bucket";
    process.env.PELATFORM_S3_ACCESS_KEY_ID = "key";
    process.env.PELATFORM_S3_SECRET_ACCESS_KEY = "secret";
    process.env.PELATFORM_S3_PUBLIC_URL = "https://cdn.example.com";
    const s3 = createS3();
    expect(s3.getProvider()).toBe("aws");
    expect(s3.getBucket()).toBe("bucket");
    expect(s3.getRegion()).toBe("us-east-1");
    expect(s3.getPublicUrl("a.txt")).toBe("https://cdn.example.com/bucket/a.txt");
  });

  it("createCloudinary loads config from env", () => {
    process.env.PELATFORM_S3_PROVIDER = "cloudinary";
    process.env.PELATFORM_CLOUDINARY_CLOUD_NAME = "cloud";
    process.env.PELATFORM_CLOUDINARY_API_KEY = "key";
    process.env.PELATFORM_CLOUDINARY_API_SECRET = "secret";
    process.env.PELATFORM_CLOUDINARY_SECURE = "true";
    process.env.PELATFORM_CLOUDINARY_FOLDER = "uploads";
    const cloud = createCloudinary();
    expect(cloud.getProvider()).toBe("cloudinary");
    expect(cloud.getConfig().cloudName).toBe("cloud");
    expect(cloud.getPublicUrl("folder/photo.jpg")).toBe(
      "https://res.cloudinary.com/cloud/image/upload/folder/photo.jpg",
    );
  });
});
