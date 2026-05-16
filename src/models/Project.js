import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: String }, 
    category: {
      type: String,
      enum: ["electronics", "software", "calculator-games"],
      required: true,
    },
    repoLink: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);