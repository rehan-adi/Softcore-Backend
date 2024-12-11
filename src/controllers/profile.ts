import { client } from '../lib/redis.js';
import { Request, Response } from 'express';
import userModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { updateProfileValidation } from '../validations/profile.validation.js';

const PROFILE_CACHE_KEY = (userId: string) => `profile:${userId}`;
const POSTS_CACHE_KEY = (userId: string) => `posts:${userId}`;
const cacheTTL = 43200;

// create profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    'You are not authenticated. Please log in to access this route.'
            });
        }

        const cachedProfileData = await client.get(PROFILE_CACHE_KEY(userId));
        const cachedPostsData = await client.get(POSTS_CACHE_KEY(userId));

        if (cachedProfileData && cachedPostsData) {
            return res.status(200).json({
                success: true,
                profile: JSON.parse(cachedProfileData),
                posts: JSON.parse(cachedPostsData)
            });
        }

        const userProfile = await userModel
            .findById(userId)
            .select('-password');

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message:
                    'Your profile could not be found. Please ensure you are logged in with the correct account.'
            });
        }

        const userPosts = await postModel
            .find({ author: userId })
            .populate('author', 'username profilePicture fullname')
            .populate('image');

        await client.set(
            PROFILE_CACHE_KEY(userId),
            JSON.stringify(userProfile),
            {
                EX: cacheTTL
            }
        );
        await client.set(POSTS_CACHE_KEY(userId), JSON.stringify(userPosts), {
            EX: cacheTTL
        });

        return res.status(200).json({
            success: true,
            profile: userProfile,
            posts: userPosts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// update profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const parsedData = updateProfileValidation.parse(req.body);
        const { username, bio } = parsedData;

        const localImagePath = req.file ? req.file.path : null;

        let imageUrl: string | null = null;

        if (localImagePath) {
            const uploadResponse = await uploadOnCloudinary(localImagePath);
            imageUrl = uploadResponse ? uploadResponse.secure_url : null;
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    'You are not authenticated. Please log in to access this route.'
            });
        }

        const profile = await userModel.findById(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        const updatedProfileData = {
            ...(username && { username }), // Update username if provided
            ...(imageUrl && { profilePicture: imageUrl }), // Update profile picture if provided
            ...(bio && { bio }) // Update bio if provided
        };

        const updatedProfile = await userModel.findByIdAndUpdate(
            userId,
            updatedProfileData,
            { new: true }
        );

        await client.del(PROFILE_CACHE_KEY(userId));
        await client.del(POSTS_CACHE_KEY(userId));

        return res.status(200).json({
            success: true,
            profile: updatedProfile,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// get other users profile
export const getUsersProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const profile = await userModel.findById(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'User Profile not found'
            });
        }

        const userPosts = await postModel.find({ author: userId }).populate({
            path: 'author',
            select: 'username profilePicture fullname',
            model: 'User'
        });

        return res.status(200).json({
            success: true,
            profile: profile,
            posts: userPosts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
