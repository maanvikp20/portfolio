import Certification from "@/src/models/Certification";
import connectDB from "@/src/lib/mongodb";

// get all certs
export const getAllCertifications = async () => {
  await connectDB();

  // get certs by most recent and convert _id to string for frontend
  const certs = await Certification.find({}).sort({ createdAt: -1 }).lean();
  return certs.map((c) => ({ ...c, _id: c._id.toString() }));
};