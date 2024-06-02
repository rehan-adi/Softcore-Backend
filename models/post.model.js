import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Content should have at least 10 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog_user_model",
    },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog_user_model" }],
    tags: [{ type: String, trim: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog_category_model"
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("Blog_post", postSchema);

export default postModel;
