import commentModel from "../models/comment.model.js";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { authorId, content } = req.body;

    if (!authorId || !content) {
        return res.status(400).json({
          success: false,
          message: "Author ID and content are required",
        });
      }

    const post = await postModel.findById(postId);
    const user = await userModel.findById(authorId);

    if (!post || !user) {
      return res.status(404).json({
        success: false,
        message: "Post or user not found",
      });
    }

    const comment = await commentModel.create({
      post: postId,
      author: authorId,
      content,
    });

    return res.status(201).json({
      success: true,
      comment: {
        id: comment._id,
        post: comment.post,
        author: comment.author,
        content: comment.content,
      },
      message: "Comment created",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};


export const getAllComments = async(req, res) => {
  try {
    const allComment = await commentModel.find().populate("author", 'username profilePicture');
    return res.status(200).json({
      success: true,
      comments: {
        allComment: allComment
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get comment",
      error: error.message,
    });
  }
}