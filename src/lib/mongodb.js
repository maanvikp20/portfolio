// connects to mongodb
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing in .env");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB Connected");
};

export default connectDB;