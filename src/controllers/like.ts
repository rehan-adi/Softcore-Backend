import mongoose from 'mongoose';
import { client } from '../lib/redis.js';
import { Request, Response } from 'express';
import postModel from '../models/post.model.js';

const POSTS_CACHE_KEY = (userId: string) => `posts:${userId}`;

export const like = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        if (
            !mongoose.Types.ObjectId.isValid(userId) ||
            !mongoose.Types.ObjectId.isValid(postId)
        ) {
            return res.status(400).json({ error: 'Invalid user or post ID' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const hasLiked = post.likes.some((like) =>
            new mongoose.Types.ObjectId(like).equals(userObjectId)
        );

        if (hasLiked) {
            post.likes = post.likes.filter(
                (like) =>
                    !new mongoose.Types.ObjectId(like).equals(userObjectId)
            );
            await post.save();
            await client.del('posts:all');
            await client.del(POSTS_CACHE_KEY(userId));

            return res.json({
                success: true,
                post,
                totalLikes: post.likes.length,
                message: 'Post unliked successfully'
            });
        } else {
            post.likes.push(userObjectId);
            await post.save();
            await client.del('posts:all');
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
