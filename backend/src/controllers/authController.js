const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const sendOtpEmail = async (email, name, otp, purpose) => {
  const payload = {
    to: email,
    subject: `Your ${purpose} OTP`,
    html: `<p>Hello ${name || "User"},</p><p>Your OTP is <strong>${otp}</strong>.</p><p>This OTP expires in 10 minutes.</p>`,
  };

  try {
    await sendEmail(payload);
    return { sent: true };
  } catch (error) {
    error.code = error.code || "EMAIL_SEND_FAILED";
    throw error;
  }
};

const issueRegistrationOtp = async (user, purpose = "registration") => {
  const { otp, hashedOtp, otpExpiresAt } = await generateOtp();
  await sendOtpEmail(user.email, user.name, otp, purpose);

  user.otp = hashedOtp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  return { otp, sent: true };
};

const handleOtpServiceUnavailable = (res, message) =>
  res.status(503).json({
    success: false,
    message,
  });

const isOtpEmailServiceError = (error) =>
  error.code === "EMAIL_SERVICE_NOT_CONFIGURED" || error.code === "EMAIL_SEND_FAILED";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(409).json({ success: false, message: "User already exists" });
      }

      existingUser.name = name;
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.isEmailVerified = false;
      await issueRegistrationOtp(existingUser, "registration");

      return res.status(200).json({
        success: true,
        message: process.env.NODE_ENV !== "production"
          ? "Account already exists but is not verified. OTP generated. Check backend console for the code if email delivery fails."
          : "Account already exists but is not verified. A new OTP has been sent to your email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
    });

    await issueRegistrationOtp(user, "registration");

    return res.status(201).json({
      success: true,
      message: process.env.NODE_ENV !== "production"
        ? "Registration successful. OTP generated. Check backend console for the code if email delivery fails."
        : "Registration successful. OTP sent to your email.",
    });
  } catch (error) {
    if (isOtpEmailServiceError(error)) {
      return handleOtpServiceUnavailable(
        res,
        "Email service is not configured. OTP cannot be sent."
      );
    }
    return res.status(500).json({ success: false, message: error.message || "Failed to register" });
  }
};

const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    const validOtp = await bcrypt.compare(String(otp), user.otp);
    if (!validOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to verify OTP" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    if (!user.isEmailVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email first" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ success: false, message: "Invalid credentials" });

    await issueRegistrationOtp(user, "login");

    return res.status(200).json({
      success: true,
      message: process.env.NODE_ENV !== "production"
        ? "Login OTP generated. Check backend console for the code if email delivery fails."
        : "Login OTP sent to your email",
    });
  } catch (error) {
    if (isOtpEmailServiceError(error)) {
      return handleOtpServiceUnavailable(
        res,
        "Email service is not configured. OTP cannot be sent."
      );
    }
    return res.status(500).json({ success: false, message: error.message || "Failed to login" });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    const validOtp = await bcrypt.compare(String(otp), user.otp);
    if (!validOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login verified successfully",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to verify OTP" });
  }
};

const profile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: safeUser(req.user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to load profile" });
  }
};

const resendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    await issueRegistrationOtp(user, "registration");

    return res.status(200).json({
      success: true,
      message: process.env.NODE_ENV !== "production"
        ? "OTP regenerated. Check the backend console if email delivery fails."
        : "OTP resent to your email.",
    });
  } catch (error) {
    if (isOtpEmailServiceError(error)) {
      return handleOtpServiceUnavailable(
        res,
        "Email service is not configured. OTP cannot be sent."
      );
    }
    return res.status(500).json({ success: false, message: error.message || "Failed to resend OTP" });
  }
};

const resetDemoAccount = async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ success: false, message: "Not available in production" });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const deleted = await User.deleteOne({ email: email.toLowerCase() });
    return res.status(200).json({
      success: true,
      message: deleted.deletedCount
        ? "Demo account deleted"
        : "No matching account found",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to reset demo account" });
  }
};

module.exports = { register, verifyRegisterOtp, resendRegisterOtp, resetDemoAccount, login, verifyLoginOtp, profile };
