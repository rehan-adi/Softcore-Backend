import { Request, Response } from 'express';
import postModel from '../models/post.model.js';
import { CustomRequest } from '../interfaces/interfaces.js';

export const like = async (req: CustomRequest, res: Response) => {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already liked the post
        if (post.likes.includes(userId)) {
            return res
                .status(400)
                .json({ error: 'User has already liked this post' });
        }

        post.likes.push(userId);
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
