import { beforeEach, describe, expect, it } from "vitest";

import { ENV_VARS, getStorageEnvVars, getStorageProvider } from "@/config";

describe("Storage Config Utilities", () => {
  beforeEach(() => {
    const keys = Object.values(ENV_VARS) as string[];
    keys.forEach((key) => {
      delete (process.env as any)[key];
    });
  });

  it("getStorageProvider returns undefined when not configured", () => {
    expect(getStorageProvider()).toBeUndefined();
  });

  it("getStorageProvider autodetects providers", () => {
    process.env.PELATFORM_CLOUDINARY_CLOUD_NAME = "cloud";
    expect(getStorageProvider()).toBe("cloudinary");
    delete process.env.PELATFORM_CLOUDINARY_CLOUD_NAME;
    process.env.PELATFORM_S3_BUCKET = "bucket";
    expect(getStorageProvider()).toBe("aws");
  });

  it("getStorageProvider respects explicit provider", () => {
    process.env.PELATFORM_S3_PROVIDER = "cloudflare-r2";
    expect(getStorageProvider()).toBe("cloudflare-r2");
  });

  it("getStorageEnvVars masks secrets and returns set vars", () => {
    process.env.PELATFORM_S3_PROVIDER = "aws";
    process.env.PELATFORM_S3_REGION = "us-east-1";
    process.env.PELATFORM_S3_BUCKET = "my-bucket";
    process.env.PELATFORM_S3_ACCESS_KEY_ID = "AKIA12345678";
    process.env.PELATFORM_S3_SECRET_ACCESS_KEY = "secretkeyvalue";
    const vars = getStorageEnvVars();
    expect(vars.PELATFORM_S3_PROVIDER).toBe("aws");
    expect(vars.PELATFORM_S3_SECRET_ACCESS_KEY).toMatch(/^\w{4}\*\*\*$/);
  });
});
