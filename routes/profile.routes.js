import express from 'express';
import { getProfile } from '../controllers/profile.js'

import {checkLogin} from '../middleware/auth.middleware.js'

const profileRouter = express.Router();

profileRouter.get('/:id', checkLogin, getProfile);

export default profileRouter;