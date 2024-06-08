import postModel from "../models/post.model.js";
import categoryModel from "../models/category.model.js";

// create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;

    const image = req.file ? req.file.path : null;
    const author = req.user.id;

    if (!title || !content || !tags || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let categoryName = await categoryModel.findOne({ name: category });

    if (!categoryName) {
      categoryName = new categoryModel({ name: category });
      await categoryName.save();
    }

    const newBlog = await postModel.create({
      title,
      content,
      author,
      image,
      tags,
      category: categoryName._id,
    });

    return res.status(201).json({
      success: true,
      data: {
        title: newBlog.title,
        content: newBlog.content,
        author: newBlog.author,
        image: newBlog.image,
        tags: newBlog.tags,
        category: categoryName.name,
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
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const allBlogPosts = await postModel.find().skip(skip).limit(limit).populate({
      path: "author",
      select: "username profilePicture",
      model: "Blog_user_model",
    }).populate('category', 'name');
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
        totalPages: Math.ceil(totalBlogPosts / limit),
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

// get posts by category
export const getPostsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const categoryExists = await categoryModel.findById(categoryId);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const posts = await postModel
      .find({ category: categoryId })
      .populate("author", "name")
      .populate("category", "name");

    return res.status(200).json({
      success: true,
      data: {
        posts,
      },
      message: "Posts retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get posts by category",
      error: error.message,
    });
  }
};

// update a blog post
export const updateBlog = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { body } = req;

    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to update: Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to update this post",
        });
    }

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
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to delete: Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to delete this post",
        });
    }

    const deletePost = await postModel.findByIdAndDelete(postId);

    if (!deletePost) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to delete: Post not found" });
    }

    return res.status(200).json({
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
