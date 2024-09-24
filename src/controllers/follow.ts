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

        // Initialize following if undefined
        if (!user.following) {
            user.following = []; // Initialize as an empty array
        }

        // Check if already following
        if (user.following.includes(followUserObjectId.toString())) {
            return res.status(400).json({
                success: false,
                message: 'You are already following this user'
            });
        }

        // Add to following and followers lists
        user.following.push(followUserObjectId);
        followUser.followers.push(userObjectId);

        // Save both users in parallel
        await Promise.all([user.save(), followUser.save()]);

        res.status(200).json({
            success: true,
            message: 'Successfully followed the user'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to follow user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};


export const unfollowUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const unfollowUserId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(unfollowUserId)) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid user ID' });
        }

        const user = await userModel.findById(userId);
        const followUser = await userModel.findById(unfollowUserId);

        if (!user || !followUser) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }

        if (userId === unfollowUserId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot unfollow yourself'
            });
        }

        user.following = user.following.filter(
            (id) => id.toString() !== unfollowUserId
        );
        unfollowUser.followers = unfollowUser.followers.filter(
            (id) => id.toString() !== userId
        );

        await user.save();
        await unfollowUser.save();

        res.status(200).json({ message: 'Successfully unfollowed the user' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to unfollow user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getFollowingList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const user = await userModel
            .findById(userId)
            .populate('following', 'username email profilePicture');
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

export const getFollowersList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const user = await userModel.findById(userId).populate({
            path: 'followers',
            select: 'username email profilePicture bio'
        });

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }

        const followers = user.followers.map((follower) => ({
            username: follower.username,
            email: follower.email,
            profilePicture: follower.profilePicture,
            bio: follower.bio
        }));

        return res.status(200).json({ success: true, followers: followers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failde to get user followings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
