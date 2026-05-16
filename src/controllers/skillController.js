import Skill from "@/src/models/Skill";
import connectDB from "@/src/lib/mongodb";

export const getAllSkills = async () => {
  await connectDB();
  // Sort by order first, then alphabetically
  const skills = await Skill.find({}).sort({ order: 1, name: 1 }).lean();
  
  // Convert _id to string for frontend
  return skills.map((skill) => ({
    ...skill,
    _id: skill._id.toString()
  }));
};

// create skill
export const createSkill = async (data) => {
  await connectDB();
  const skill = await Skill.create(data);
  return JSON.parse(JSON.stringify(skill));
};

// update skill by id
export const updateSkill = async (id, data) => {
  await connectDB();
  const skill = await Skill.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!skill) return null;
  return { ...skill, _id: skill._id.toString() };
};

// delete skill by id
export const deleteSkill = async (id) => {
  await connectDB();
  return await Skill.findByIdAndDelete(id);
};