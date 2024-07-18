import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: [1, 'Content cannot be empty']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog_user_model',
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog_post',
            required: true
        },
        likes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Blog_user_model' }
        ]
    },
    { timestamps: true }
);

const CommentModel = mongoose.model('Blog_comment_model', commentSchema);

export default CommentModel;
