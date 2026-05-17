import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },       
  company: { type: String, required: true },     
  location: { type: String },                    
  startDate: { type: String, required: true },   
  endDate: { type: String, default: "Present" },
  description: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);