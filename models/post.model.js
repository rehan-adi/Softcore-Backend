import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog_user_model",
    },
    image: { type: String},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog_user_model" }],
    tags: [{ type: String }],
    category: { type: String },
  },
  { timestamps: true }
);

const postModel = mongoose.model('Blog_post', postSchema);

export default postModel;
