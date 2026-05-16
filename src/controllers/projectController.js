import Project from "@/src/models/Project";
import connectDB from "@/src/lib/mongodb";

// get all projects
export const getAllProjects = async () => {
  await connectDB();

  // get projects by most recent and convert _id to string for frontedn
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
  
  // convert _id to string for frontend
  return projects.map((project) => ({
    ...project,
    _id: project._id.toString()
  }));
};

// create project
export const createProject = async (data) => {
  await connectDB();
  const project = await Project.create(data);
  return JSON.parse(JSON.stringify(project)); // make sure _id is stringified for front
};

// update project by id
export const updateProject = async (id, data) => {
  await connectDB();

  // if title updated also update slug
  const project = await Project.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!project) return null;
  return { ...project, _id: project._id.toString() };
};

// delete projcet by id
export const deleteProject = async (id) => {
  await connectDB();
  return await Project.findByIdAndDelete(id);
};