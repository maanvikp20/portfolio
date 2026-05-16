import User from "@/src/models/User";
import connectDB from "@/src/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (email, password) => {
  await connectDB();

  // See if user exists with email
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  // check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // Create jwt token with user ID and admin role
  const token = jwt.sign(
    { userId: user._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return { user: { name: user.name, email: user.email }, token };
};
