import { config } from "dotenv"
import mongoose from "mongoose"
config()

export const connectDB = async () => {
  try {
    const url = process.env.MONGODB_URI
    if (!url) {
      throw new Error("MONGODB_URI is not defined in environment variables")
    }

    await mongoose.connect(url)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.log("MongoDB connection error:", error.message)
  }
}
