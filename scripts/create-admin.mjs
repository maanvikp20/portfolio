// Creates (or resets the password of) the admin account.
//
//   ADMIN_PASSWORD='a-long-password' npm run create-admin -- you@example.com "Your Name"
//
// Reads MONGODB_URI from .env.local (see package.json script).
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [email, name = "Admin"] = process.argv.slice(2);
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error(
    'Usage: ADMIN_PASSWORD="..." npm run create-admin -- <email> ["Your Name"]',
  );
  process.exit(1);
}
if (password.length < 12) {
  console.error("Use a password of at least 12 characters.");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set (put it in .env.local).");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const users = mongoose.connection.collection("users");
const hash = await bcrypt.hash(password, 12);
const result = await users.updateOne(
  { email: email.trim() },
  {
    $set: { name, password: hash, updatedAt: new Date() },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true },
);
console.log(
  result.upsertedCount
    ? `Created admin ${email}`
    : `Updated password for ${email}`,
);
await mongoose.disconnect();
