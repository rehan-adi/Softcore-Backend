import { Request, Response } from 'express';
import userModel from '../models/user.model.js';
import mongoose from 'mongoose';

export const followUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const followUserId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(followUserId)) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid user ID' });
        }

        const user = await userModel.findById(userId);
        const followUser = await userModel.findById(followUserId);

        if (!user || !followUser) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }

        if (user.following.includes(followUserId)) {
            return res.status(400).json({
                success: false,
                message: 'You are already following this user'
            });
        }

        user.following.push(followUserId);
        followUser.followers.push(userId);

        await user.save();
        await followUser.save();

        res.status(200).json({
            success: true,
            message: 'Successfully followed the user'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to follow user',
            error: error.message
        });
    }
};

export const unfollowUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
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
            error: error.message
        });
    }
};

export const getFollowingList = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
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
            error: error.message
        });
    }
};

export const getFollowersList = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

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
            error: error.message
        });
    }
};
