const nodemailer = require("nodemailer");

const requiredEnvKeys = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"];

const hasValidSmtpConfig = () => requiredEnvKeys.every((key) => String(process.env[key] || "").trim());

const createTransporter = () => {
  if (!hasValidSmtpConfig()) {
    console.warn(
      "[smtp] Email service is not configured. Missing one or more of SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM."
    );
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const verifyTransporterSafely = async () => {
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.warn(`[smtp] SMTP verification failed, but server will continue: ${error.message}`);
    return false;
  }
};

module.exports = {
  transporter,
  hasValidSmtpConfig,
  verifyTransporterSafely,
};
