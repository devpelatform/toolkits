import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getEmailEnvVars,
  hasEmailConfig,
  loadEmailConfig,
  loadNodemailerConfig,
  loadResendConfig,
  validateEmailEnvVars,
  validateNodemailerEnvVars,
} from "@pelatform/email";

describe("Email Configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear all PELATFORM_EMAIL environment variables
    delete process.env.PELATFORM_EMAIL_RESEND_API_KEY;
    delete process.env.PELATFORM_EMAIL_FROM_NAME;
    delete process.env.PELATFORM_EMAIL_FROM_EMAIL;
    delete process.env.PELATFORM_EMAIL_REPLY_TO;
    delete process.env.PELATFORM_EMAIL_SMTP_HOST;
    delete process.env.PELATFORM_EMAIL_SMTP_PORT;
    delete process.env.PELATFORM_EMAIL_SMTP_SECURE;
    delete process.env.PELATFORM_EMAIL_SMTP_USER;
    delete process.env.PELATFORM_EMAIL_SMTP_PASS;
  });

  describe("loadEmailConfig", () => {
    it("should load Resend configuration when available", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      const config = loadEmailConfig();
      expect(config).toBeTruthy();
      expect(config?.provider).toBe("resend");
      const cfg = config as import("../src/types").ResendConfig;
      expect(cfg.apiKey).toBe("re_test_key");
      expect(cfg.from.name).toBe("Test App");
      expect(cfg.from.email).toBe("test@example.com");
    });

    it("should load Nodemailer configuration when Resend is not available", () => {
      delete process.env.PELATFORM_EMAIL_RESEND_API_KEY;
      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_PORT = "587";
      process.env.PELATFORM_EMAIL_SMTP_USER = "user@example.com";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "password";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "sender@example.com";

      const config = loadEmailConfig();
      expect(config).toBeTruthy();
      expect(config?.provider).toBe("nodemailer");
      const cfg = config as import("../src/types").NodemailerConfig;
      expect(cfg.smtp.host).toBe("smtp.example.com");
      expect(cfg.smtp.port).toBe(587);
      expect(cfg.smtp.auth.user).toBe("user@example.com");
      expect(cfg.from.name).toBe("Test App");
      expect(cfg.from.email).toBe("sender@example.com");
    });

    it("should return null when no provider is configured", () => {
      const config = loadEmailConfig();
      expect(config).toBeNull();
    });

    it("should prefer Resend over Nodemailer when both are configured", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_PORT = "587";
      process.env.PELATFORM_EMAIL_SMTP_USER = "user@example.com";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "password";

      const config = loadEmailConfig();

      expect(config?.provider).toBe("resend");
    });
  });

  describe("loadResendConfig", () => {
    it("should load Resend configuration", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "resend@example.com";

      const config = loadResendConfig();
      expect(config).toBeTruthy();
      expect(config?.provider).toBe("resend");
      const cfg = config as import("../src/types").ResendConfig;
      expect(cfg.apiKey).toBe("re_test_key");
      expect(cfg.from.email).toBe("resend@example.com");
      expect(cfg.from.name).toBe("Test App");
    });

    it("should return null when API key is missing", () => {
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";
      // Missing PELATFORM_EMAIL_RESEND_API_KEY

      const config = loadResendConfig();
      expect(config).toBeNull();
    });

    it("should return null when from name is missing", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";
      // Missing PELATFORM_EMAIL_FROM_NAME

      const config = loadResendConfig();
      expect(config).toBeNull();
    });

    it("should return null when from email is missing", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      // Missing PELATFORM_EMAIL_FROM_EMAIL

      const config = loadResendConfig();
      expect(config).toBeNull();
    });

    it("should include replyTo when set", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";
      process.env.PELATFORM_EMAIL_REPLY_TO = "reply@example.com";

      const config = loadResendConfig();

      expect(config?.replyTo).toBe("reply@example.com");
    });
  });

  describe("loadNodemailerConfig", () => {
    it("should load Nodemailer configuration with all settings", () => {
      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_PORT = "465";
      process.env.PELATFORM_EMAIL_SMTP_SECURE = "true";
      process.env.PELATFORM_EMAIL_SMTP_USER = "user@example.com";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "password";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "sender@example.com";
      process.env.PELATFORM_EMAIL_REPLY_TO = "reply@example.com";

      const config = loadNodemailerConfig();
      expect(config).toBeTruthy();
      expect(config?.provider).toBe("nodemailer");
      const cfg = config as import("../src/types").NodemailerConfig;
      expect(cfg.smtp.host).toBe("smtp.example.com");
      expect(cfg.smtp.port).toBe(465);
      expect(cfg.smtp.secure).toBe(true);
      expect(cfg.smtp.auth.user).toBe("user@example.com");
      expect(cfg.smtp.auth.pass).toBe("password");
      expect(cfg.from.email).toBe("sender@example.com");
      expect(cfg.from.name).toBe("Test App");
      expect(cfg.replyTo).toBe("reply@example.com");
    });

    it("should return null when required settings are missing", () => {
      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_USER = "user@example.com";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "password";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "sender@example.com";
      // Missing port (required)

      const config = loadNodemailerConfig();
      expect(config).toBeNull();
    });

    it("should return null when required user settings are missing", () => {
      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_PORT = "587";
      // Missing user, pass, from name, or from email

      const config = loadNodemailerConfig();
      expect(config).toBeNull();
    });

    it("should parse port numbers correctly", () => {
      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_PORT = "465"; // string
      process.env.PELATFORM_EMAIL_SMTP_SECURE = "true";
      process.env.PELATFORM_EMAIL_SMTP_USER = "user@example.com";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "password";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      const config = loadNodemailerConfig();
      const cfg = config as import("../src/types").NodemailerConfig | null;
      expect(cfg?.smtp.port).toBe(465);
      expect(cfg?.smtp.secure).toBe(true);
    });
  });

  describe("validateEmailEnvVars", () => {
    it("should validate Resend configuration", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      const result = validateEmailEnvVars();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate Nodemailer configuration", () => {
      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_PORT = "587";
      process.env.PELATFORM_EMAIL_SMTP_USER = "user@example.com";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "password";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      const result = validateEmailEnvVars();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return errors for missing required variables", () => {
      const result = validateEmailEnvVars();

      expect(result.valid).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
    });
  });

  describe("validateNodemailerEnvVars", () => {
    it("should error when SMTP port is out of range", () => {
      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_PORT = "70000";
      process.env.PELATFORM_EMAIL_SMTP_USER = "user@example.com";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "password";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      const result = validateNodemailerEnvVars();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("SMTP_PORT must be a valid port number (1-65535)");
    });
  });

  describe("getEmailEnvVars", () => {
    it("should return masked environment variables", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_secret_key_123456";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "secret_password";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      const envVars = getEmailEnvVars();

      expect(envVars.PELATFORM_EMAIL_RESEND_API_KEY).toBe("***");
      expect(envVars.PELATFORM_EMAIL_SMTP_PASS).toBe("***");
      expect(envVars.PELATFORM_EMAIL_FROM_EMAIL).toBe("test@example.com");
    });

    it("should handle missing variables", () => {
      const envVars = getEmailEnvVars();

      expect(envVars.PELATFORM_EMAIL_RESEND_API_KEY).toBeUndefined();
      expect(envVars.PELATFORM_EMAIL_SMTP_PASS).toBeUndefined();
    });
  });

  describe("hasEmailConfig", () => {
    it("should return true when Resend is configured", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      expect(hasEmailConfig()).toBe(true);
    });

    it("should return true when Nodemailer is configured", () => {
      process.env.PELATFORM_EMAIL_SMTP_HOST = "smtp.example.com";
      process.env.PELATFORM_EMAIL_SMTP_PORT = "587";
      process.env.PELATFORM_EMAIL_SMTP_USER = "user@example.com";
      process.env.PELATFORM_EMAIL_SMTP_PASS = "password";
      process.env.PELATFORM_EMAIL_FROM_NAME = "Test App";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      expect(hasEmailConfig()).toBe(true);
    });

    it("should return false when no provider is configured", () => {
      expect(hasEmailConfig()).toBe(false);
    });

    it("should return false when configuration is incomplete", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "re_test_key";
      // Missing from name and email

      expect(hasEmailConfig()).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string environment variables", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "";
      process.env.PELATFORM_EMAIL_FROM_NAME = "";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "";

      const config = loadEmailConfig();
      expect(config).toBeNull();
    });

    it("should handle whitespace-only environment variables", () => {
      process.env.PELATFORM_EMAIL_RESEND_API_KEY = "   ";
      process.env.PELATFORM_EMAIL_FROM_NAME = "   ";
      process.env.PELATFORM_EMAIL_FROM_EMAIL = "test@example.com";

      const config = loadEmailConfig();
      expect(config).toBeTruthy();
      expect(config?.provider).toBe("resend");
      const cfg = config as import("../src/types").ResendConfig;
      expect(cfg.apiKey).toBe("   ");
      expect(cfg.from.name).toBe("   ");
    });
  });
});
