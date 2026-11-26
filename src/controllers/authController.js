import User from "@/src/models/User";
import connectDB from "@/src/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// A real bcrypt hash of a throwaway password. When the email isn't found we still
// run a comparison against this, so "no such user" and "wrong password" take the
// same time and can't be told apart by timing.
const DUMMY_HASH =
  "$2b$10$54VTat5kO3g2RzuM0IW6kefChMUuqUl3aexyQ7MqBvaLZ0Qk6dkKq";

export const loginAdmin = async (email, password) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
    throw new Error(
      "JWT_SECRET is missing or too short (use 16+ random characters).",
    );
  }

  await connectDB();

  // See if user exists with email
  const user = await User.findOne({ email: email.trim() });

  // always run one bcrypt comparison, whether or not the user exists
  const isMatch = await bcrypt.compare(
    password,
    user ? user.password : DUMMY_HASH,
  );
  if (!user || !isMatch) throw new Error("Invalid credentials");

  // Create jwt token with user ID and admin role
  const token = jwt.sign(
    { userId: user._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d", algorithm: "HS256" },
  );

  return { user: { name: user.name, email: user.email }, token };
};
