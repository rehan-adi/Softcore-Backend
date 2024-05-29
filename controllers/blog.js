import postModel from "../models/post.model.js";

// create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, author, image, tags, category } = req.body;

    if (!title || !content || !author || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newBlog = await postModel.create({
      title,
      content,
      author,
      image,
      tags,
      category,
    });

    return res.status(201).json({
      success: true,
      data: {
        title: newBlog.title,
        content: newBlog.content,
        author: newBlog.author,
        image: newBlog.image,
        tags: newBlog.tags,
        category: newBlog.category,
      },
      message: "Blog created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// get all blog
export const getAllBlogPosts = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const allBlogPosts = await postModel.find().skip(skip).limit(limit);
    const totalBlogPosts = await postModel.countDocuments();
    return res.status(200).json({
      success: true,
      data: {
        blogPost: allBlogPosts,
      },
      pagination: {
        total: totalBlogPosts,
        page,
        limit,
        totalPages: Math.ceil(totalBlogs / limit),
      },
      message: "All blogs retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all blog posts",
      error: error.message,
    });
  }
};

// update a blog post
export const updateBlog = async (req, res) => {
  try {
    const postId = req.params.id;
    const { body } = req;
    const updatedPost = await postModel.findByIdAndUpdate(postId, body, {
      new: true,
    });

    if (!updatedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to update: Post not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        post: updatedPost,
      },
      message: "Blog post updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// delete a blog post
export const deleteBlog = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const deletePost = await postModel.findByIdAndDelete(postId);

    if (!deletePost) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to delete: Post not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        deletedPostId: postId,
        message: "Post deleted successfully",
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog post",
      error: error.message,
    });
  }
};
