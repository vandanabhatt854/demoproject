const express = require("express");
const cors = require("cors");
require("dotenv").config();

const healthRoutes = require("./routes/healthRoutes");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("./config/cloudinary");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
