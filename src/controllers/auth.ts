import bcrypt from 'bcrypt';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { Request, Response } from 'express';
import userModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import {
    signinValidation,
    signupValidation
} from '../validations/user.validation.js';
import { changePasswordValidation } from '../validations/user.validation.js';

export const signup = async (req: Request, res: Response) => {
    try {
        // Parse and validate the request body using Zod
        const parsedData = signupValidation.parse(req.body);
        const { username, fullname, email, password, profilePicture } =
            parsedData;

        // Check if the user already exists
        const oldUser = await userModel.findOne({ email });
        if (oldUser) {
            return res
                .status(400)
                .json({ success: false, message: 'User already exists' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user record
        const User = await userModel.create({
            username,
            fullname,
            email,
            password: hashedPassword,
            profilePicture
        });

        // Return the created user details (excluding the password)
        return res.status(201).json({
            success: true,
            user: {
                id: User._id,
                username: User.username,
                fullname: User.fullname,
                email: User.email,
                profilePicture: User.profilePicture,
                bio: User.bio
            },
            message: 'User created successfully'
        });
    } catch (error) {
        // Handle validation errors from Zod
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map((e) => e.message)
            });
        }
        // Log the error and return a server error response
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'failed to signup',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const parsedData = signinValidation.parse(req.body);
        const { email, password } = parsedData;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    'User is not registered with this email. Please register to continue.'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password. Please try again.'
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            config.JWT_SECRET,
            { expiresIn: '72h' }
        );

        res.cookie('token', token, {
            maxAge: 72 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        return res.status(200).json({
            success: true,
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio
            },
            message: 'Login successful'
        });
    } catch (error) {
        // Handle validation errors from Zod
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map((e) => e.message)
            });
        }
        // Log the error and return a server error response
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to sign in',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        // Clear the token from client's cookies
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict'
        });

        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to log out',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const parsedData = changePasswordValidation.parse(req.body);

        const { password } = parsedData;

        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        return res
            .status(200)
            .json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during changing password:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const usedId = req.user?.id;

        const user = await userModel.findById(usedId);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        };

        // delete user details
        await userModel.findByIdAndDelete(usedId);

        // delete post of user
        await postModel.deleteMany({ author: usedId });

        return res.status(200).json({ success: true, message: 'Account deleted successfully' });

    } catch (error) {
        console.error('Error during deleting account:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
