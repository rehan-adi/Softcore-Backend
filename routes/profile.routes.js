import express from 'express';
import upload from '../utils/multer.js'
import { getProfile, updateProfile } from '../controllers/profile.js'
import {checkLogin} from '../middleware/auth.middleware.js'

const profileRouter = express.Router();

profileRouter.get('/:id', checkLogin, getProfile);
profileRouter.patch('/:id', checkLogin, upload.single('image'), updateProfile);

export default profileRouter;