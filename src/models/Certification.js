import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    date: { type: String },
    link: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Certification || mongoose.model("Certification", CertificationSchema);