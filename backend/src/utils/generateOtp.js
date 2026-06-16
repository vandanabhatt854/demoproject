const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const OTP_EXPIRES_IN_MINUTES = Number(process.env.OTP_EXPIRES_IN_MINUTES || 10);

const generateOtp = async () => {
  const otp = String(crypto.randomInt(100000, 1000000));
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);

  return { otp, hashedOtp, otpExpiresAt };
};

module.exports = generateOtp;
