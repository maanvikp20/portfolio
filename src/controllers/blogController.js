import Blog from "@/src/models/Blog";
import User from "@/src/models/User";
import connectDB from "@/src/lib/mongodb";

// get all blogs
export const getAllBlogs = async (status = "published") => {
  await connectDB();

  // If status is "all", find all blogs otherwise filter by status
  const query = status === "all" ? {} : { status };

  // Fetch blogs with author deets and sort by published date
  const blogs = await Blog.find(query)
    .populate("author", "name email")
    .sort({ publishedAt: -1 })
    .lean();

  // Convert _id and author._id to strings for client use
  return blogs.map((blog) => ({
    ...blog,
    _id: blog._id.toString(),
    author: blog.author
      ? { ...blog.author, _id: blog.author._id.toString() }
      : null,
  }));
};

// get a specific blog by slug
export const getBlogBySlug = async (slug) => {
  await connectDB();

  // get specific blog and populate author deets
  const blog = await Blog.findOne({ slug }).populate("author", "name").lean();
  if (!blog) throw new Error("Blog not found");

  // Convert _id and author._id to strings for client use
  return {
    ...blog,
    _id: blog._id.toString(),
    author: blog.author
      ? { ...blog.author, _id: blog.author._id.toString() }
      : null,
  };
};

// create blog
export const createBlog = async (data) => {
  await connectDB();

  // regex to create slug from title
  if (!data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  // create blog and return it
  const blog = await Blog.create(data);
  return JSON.parse(JSON.stringify(blog));
};
