import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
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
        followers: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Blog_user_model' }
        ],
        following: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Blog_user_model' }
        ],
        bio: { type: String, trim: true },
        isPremium: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const userModel = mongoose.model('Blog_user_model', userSchema);

export default userModel;
