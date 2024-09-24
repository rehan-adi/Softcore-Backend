import { Request, Response } from 'express';
import postModel from '../models/post.model.js';
import mongoose from 'mongoose';

export const like = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.likes.some((like) => like.equals(userObjectId))) {
            return res
                .status(400)
                .json({ error: 'User has already liked this post' });
        }

        post.likes.push(userObjectId);
        await post.save();

        res.json({
            success: true,
            post,
            totalLikes: post.likes.length
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to like',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
