import { Request, Response } from 'express';
import userModel from '../models/user.model.js';
import postModel from '../models/post.model.js';

export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { query: username } = req.query;

        if (!username || typeof username !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Valid username is required'
            });
        }

        const users = await userModel
            .find({
                username: { $regex: username, $options: 'i' }
            })
            .select('-password');

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found matching your search.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User found successfully',
            user: users
        });
    } catch (error) {
        console.error(`Error in searchUsers: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Failed to search users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const searchPosts = async (req: Request, res: Response) => {
    try {
        const { title, author } = req.query;
        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (author) {
            const users = await userModel.find({
                username: { $regex: author, $options: 'i' }
            });
            if (users.length > 0) {
                const userIds = users.map((user) => user._id);
                query.author = { $in: userIds };
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Author not found'
                });
            }
        }

        const posts = await postModel
            .find(query)
            .populate('author')
            .populate('category');

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No posts found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Posts found',
            posts
        });
    } catch (error) {
        console.error(`Error in searchPosts: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Failed to search posts',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
