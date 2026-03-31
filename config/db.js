const mongoose = require("mongoose");

const connectDB = async () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing in environment variables");
  }

  await mongoose.connect(databaseUrl);
  console.log("MongoDB connected successfully");
};

module.exports = connectDB;
