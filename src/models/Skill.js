import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  percent: { type: Number, default: 0, min: 0, max: 100 },
  order: { type: Number, default: 0 }
});

const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
export default Skill;