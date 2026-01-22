import app from "./src/app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectRedis } from "./src/redis";

dotenv.config();

const PORT = 5000;

const startServer = async () => {
  try {
    await connectRedis();

    mongoose
      .connect(process.env.MONGO_URI!)
      .then(() => console.log("✅ MongoDB connected"))
      .catch((err) => console.error("❌ MongoDB connection error:", err));

    app.listen(PORT, () => {
      console.log(`🚀 VaultPay backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1); 
  }
};

startServer();