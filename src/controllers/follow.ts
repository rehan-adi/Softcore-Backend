import { Request, Response } from 'express';
import userModel from '../models/user.model.js';
import mongoose, { Types } from 'mongoose';

export const followUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const followUserId = req.params.id;

        // Check if user is authenticated
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Validate followUserId
        if (!mongoose.Types.ObjectId.isValid(followUserId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        // Convert string IDs to ObjectId
        const userObjectId = new Types.ObjectId(userId);
        const followUserObjectId = new Types.ObjectId(followUserId);

        // Fetch users from the database
        const [user, followUser] = await Promise.all([
            userModel.findById(userObjectId),
            userModel.findById(followUserObjectId)
        ]);

        // Check if users exist
        if (!user || !followUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Initialize 'following' and 'followers' if undefined
        if (!user.following) {
            user.following = []; // Initialize as an empty array
        }
        if (!followUser.followers) {
            followUser.followers = []; // Initialize as an empty array
        }

        // Check if already following
        if (user.following.some((followingId) => followingId.toString() === followUserObjectId.toString())) {
            return res.status(400).json({
                success: false,
                message: 'You are already following this user',
            });
        }

        // Add to following and followers lists
        user.following.push(followUserObjectId as unknown as mongoose.Schema.Types.ObjectId);
        followUser.followers.push(userObjectId as unknown as mongoose.Schema.Types.ObjectId);

        // Save both users in parallel
        await Promise.all([user.save(), followUser.save()]);

        res.status(200).json({
            success: true,
            message: 'Successfully followed the user',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to follow user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const unfollowUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const unfollowUserId = req.params.id;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(unfollowUserId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID',
            });
        }

        // Fetch users from the database
        const user = await userModel.findById(userId);
        const followUser = await userModel.findById(unfollowUserId);

        // Check if users exist
        if (!user || !followUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if the user is trying to unfollow themselves
        if (userId === unfollowUserId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot unfollow yourself',
            });
        }

        // Initialize following and followers arrays if they are undefined
        if (!user.following) {
            user.following = []; // Initialize as empty array
        }
        if (!followUser.followers) {
            followUser.followers = []; // Initialize as empty array
        }

        // Filter out the unfollowUserId from user's following list
        user.following = user.following.filter(
            (id) => id.toString() !== unfollowUserId
        );

        // Filter out the userId from followUser's followers list
        followUser.followers = followUser.followers.filter(
            (id) => id.toString() !== userId
        );

        // Save both users
        await Promise.all([user.save(), followUser.save()]);

        res.status(200).json({ success: true, message: 'Successfully unfollowed the user' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to unfollow user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get Logged-in User's Following List
export const getFollowingList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const user = await userModel
            .findById(userId)
            .populate('following', 'username fullname profilePicture');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User followings',
            following: user.following
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failde to get user followings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get Any User's Following List
export const getUserFollowingList = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await userModel
            .findById(userId)
            .populate('following', 'username fullname profilePicture');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User followings',
            following: user.following
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failde to get user followings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get Logged-in User's Followers List
export const getFollowersList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        // Fetch user with followers populated
        const user = await userModel.findById(userId).populate({
            path: 'followers',
            select: 'username fullname profilePicture'
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure followers is defined and has users
        if (!user.followers || user.followers.length === 0) {
            return res.status(200).json({
                success: true,
                followers: [],
                message: 'No followers found'
            });
        }

        // Return the followers list
        res.status(200).json({
            success: true,
            followers: user.followers, // followers will be of the type populated
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get followers list',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get Any User's Followers List
export const getUserFollowersList = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // Fetch user with followers populated
        const user = await userModel.findById(userId).populate({
            path: 'followers',
            select: 'username fullname profilePicture'
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure followers is defined and has users
        if (!user.followers || user.followers.length === 0) {
            return res.status(200).json({
                success: true,
                followers: [],
                message: 'No followers found'
            });
        }
        
        // Return the followers list
        res.status(200).json({
            success: true,
            followers: user.followers, // followers will be of the type populated
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get followers list',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const getFollowingStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const followUserId = req.params.id;

        // Check if user is authenticated
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Validate followUserId
        if (!mongoose.Types.ObjectId.isValid(followUserId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const followUserObjectId = new mongoose.Types.ObjectId(followUserId);

        // Find the authenticated user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const following = user.following || [];

        // Check if the user is following the target user
        const isFollowing = following.some(followingId => followingId.toString() === followUserObjectId.toString());

        return res.status(200).json({
            success: true,
            isFollowing,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get following status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

