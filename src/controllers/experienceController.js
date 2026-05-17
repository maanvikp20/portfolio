import connectDB from "@/src/lib/mongodb";
import Experience from "../models/Experience";

export async function getAllExperiences() {
  await connectDB();
  return await Experience.find({}).sort({ order: 1, createdAt: -1 }).lean();
}

export async function createExperience(data) {
  await connectDB();
  const exp = await Experience.create(data);
  return exp;
}

export async function updateExperience(id, data) {
  await connectDB();
  const exp = await Experience.findByIdAndUpdate(id, data, { 
    new: true,
    runValidators: true 
  }).lean();
  
  if (!exp) throw new Error("Experience record not found.");
  return exp;
}

export async function deleteExperience(id) {
  await connectDB();
  const exp = await Experience.findByIdAndDelete(id);
  if (!exp) throw new Error("Experience record not found.");
  return true;
}