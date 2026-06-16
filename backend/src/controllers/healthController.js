const { hasValidSmtpConfig } = require("../config/smtp");

const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    environment: process.env.NODE_ENV || "development",
    emailService: hasValidSmtpConfig() ? "configured" : "not_configured",
  });
};

module.exports = { getHealthStatus };
