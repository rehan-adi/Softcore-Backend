import express from 'express';
import upload from '../utils/multer.js';
import {
    getProfile,
    updateProfile,
    getUsersProfile
} from '../controllers/profile.js';
import { checkLogin } from '../middleware/auth.middleware.js';

const profileRouter = express.Router();

// get user profile
profileRouter.get('/:id', checkLogin, getProfile);

// update user profile
profileRouter.patch('/:id', checkLogin, upload.single('image'), updateProfile);

profileRouter.get('/users/:id', getUsersProfile);

export default profileRouter;
