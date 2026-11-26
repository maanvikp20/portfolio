// connects to mongodb
import mongoose from "mongoose";

// Serverless functions and dev-mode hot reloads can load this file many times.
// Keeping the connection (and the in-flight connect) on globalThis means it is
// opened once and reused, instead of opening a new connection per request.
const cache = (globalThis.__mongooseCache ??= { conn: null, promise: null });

const connectDB = async () => {
  if (cache.conn) return cache.conn;

  if (!process.env.MONGODB_URI)
    throw new Error("MONGODB_URI is missing in .env");

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        // fail in 8s instead of the 30s default when the database is unreachable
        serverSelectionTimeoutMS: 8000,
      })
      .catch((error) => {
        cache.promise = null; // let the next request try again
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
};

export default connectDB;
