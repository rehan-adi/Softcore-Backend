import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.js'

import {checkLogin} from '../middleware/auth.middleware.js'

const profileRouter = express.Router();

profileRouter.get('/:id', checkLogin, getProfile);
profileRouter.patch('/:id', checkLogin, updateProfile);

export default profileRouter;