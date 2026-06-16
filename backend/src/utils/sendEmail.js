const { transporter, hasValidSmtpConfig } = require("../config/smtp");

const createConfiguredEmailError = () => {
  const error = new Error("Email service is not configured");
  error.code = "EMAIL_SERVICE_NOT_CONFIGURED";
  return error;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!hasValidSmtpConfig() || !transporter) {
    throw createConfiguredEmailError();
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    const mailError = new Error(error.message || "Failed to send email");
    mailError.code = error.code || "EMAIL_SEND_FAILED";
    throw mailError;
  }
};

module.exports = sendEmail;
