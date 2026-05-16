import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    category: { 
      type: String, 
      enum: ["electronics", "software", "calculator-games"], 
      default: "software" 
    },
    status: { 
      type: String, 
      enum: ["draft", "published"], 
      default: "published" 
    },
    coverImage: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);