import { Request, Response } from 'express';
import userModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { updateProfileValidation } from '../validations/profile.validation.js';

// create profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const checkProfile = await userModel
            .findById(userId)
            .select('-password');

        if (!checkProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        const userPosts = await postModel
            .find({ author: userId })
            .populate('author', 'username profilePicture fullname')
            .populate('image');

        return res.status(200).json({
            success: true,
            profile: checkProfile,
            postCount: userPosts.length,
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
