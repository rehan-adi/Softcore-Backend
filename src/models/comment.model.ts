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
            ref: 'User',
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        likes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ]
    },
    { timestamps: true }
);

const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;
