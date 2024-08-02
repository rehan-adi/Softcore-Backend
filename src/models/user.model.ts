import mongoose from 'mongoose';
import { User } from '../interfaces/interfaces.js';

const userSchema = new mongoose.Schema<User>(
    {
        username: {
            type: String,
            trim: true,
            required: true
        },
        fullname: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            trim: true,
            index: true,
            unique: true,
            match: [/.+\@.+\..+/, 'Please enter a valid email address']
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
            minlength: [6, 'Password must be at least 6 characters long']
        },
        profilePicture: {
            type: String,
            default:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWC2HlBW_j95D0IfAqW5Ub0yp1aNnx0ixFmg&s'
        },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        bio: { type: String, trim: true },
        isPremium: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const userModel = mongoose.model<User>('User', userSchema);

export default userModel;
