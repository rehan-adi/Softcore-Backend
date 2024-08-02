import { Document, Schema } from 'mongoose';

export interface User extends Document {
    username: string;
    fullname: string;
    email: string;
    googleId?: string;
    password: string;
    profilePicture?: string;
    followers?: Schema.Types.ObjectId[];
    following?: Schema.Types.ObjectId[];
    bio?: string;
    isPremium?: boolean;
}
