require("dotenv").config({ path: __dirname + "/../../.env" });
const mongoose = require("mongoose");

// Debug log to confirm DB_URI
console.log("MongoDB URI:", process.env.DB_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI, {
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
