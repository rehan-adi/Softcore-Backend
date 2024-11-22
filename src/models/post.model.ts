import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        image: { type: String },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        tags: [{ type: String, trim: true }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    },
    { timestamps: true }
);

const postModel = mongoose.model('Post', postSchema);

export default postModel;
