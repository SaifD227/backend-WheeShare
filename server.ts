import express from "express";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
