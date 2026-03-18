import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.log("Failed to connect to the database");
  }
};
