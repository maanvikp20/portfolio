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
    // shown as a badge on the project page
    status: {
      type: String,
      enum: ["completed", "in-progress", "planned"],
      default: "completed",
    },
    // links must be empty or http(s), so a bad value can never become a javascript: href
    repoLink: {
      type: String,
      default: "",
      match: [
        /^(https?:\/\/\S+)?$/i,
        "repoLink must start with http:// or https://",
      ],
    },
    liveLink: {
      type: String,
      default: "",
      match: [
        /^(https?:\/\/\S+)?$/i,
        "liveLink must start with http:// or https://",
      ],
    },
    coverImage: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
