import userModel from '../models/Blog_user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { username, fullname, email, password, profilePicture, bio } =
            req.body;

        if (!username || !fullname || !email || !password || !bio) {
            return res
                .status(400)
                .json({ success: false, message: 'All fields are required' });
        }

        const oldUser = await userModel.findOne({ email: email });

        if (oldUser) {
            return res
                .status(400)
                .json({ success: false, message: 'User already exists' });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const User = await userModel.create({
            username,
            fullname,
            email,
            password: hashpassword,
            profilePicture,
            bio
        });

        return res.status(201).json({
            success: true,
            User: {
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'failed to signup',
            error: error.message
        });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: 'All fields are required' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    'User is not registered with this email. Please register to continue.'
            });
        }

        const passwordmatch = await bcrypt.compare(password, user.password);

        if (!passwordmatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password. Please try again.'
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '72h' }
        );

        res.cookie('token', token, {
            maxAge: 72 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to sign in',
            error: error.message
        });
    }
};

export const logout = (req, res) => {
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
            error: error.message
        });
    }
};
