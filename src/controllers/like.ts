import mongoose from 'mongoose';
import { Request, Response } from 'express';
import postModel from '../models/post.model.js';

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

        // Check if the user has already liked the post
        const hasLiked = post.likes.some((like) => like.equals(userObjectId));

        if (hasLiked) {
            post.likes = post.likes.filter((like) => !like.equals(userObjectId));
            await post.save();
            return res.json({
                success: true,
                post,
                totalLikes: post.likes.length,
                message: 'Post unliked successfully'
            });
        } else {
            post.likes.push(userObjectId);
            await post.save();
            return res.json({
                success: true,
                post,
                totalLikes: post.likes.length,
                message: 'Post liked successfully'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to like/unlike',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
