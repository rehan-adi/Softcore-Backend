import { Document, Schema } from 'mongoose';
import { Request } from 'express';

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

export interface CustomRequest extends Request {
    user?: { id: string };
}
