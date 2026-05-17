require("dotenv").config();
const dns = require("node:dns/promises");
dns.setServers(["8.8.8.8","1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit so Railway knows it failed
  });
