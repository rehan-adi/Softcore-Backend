import express from 'express';
import { like } from '../controllers/like.js';
import { checkLogin } from '../middleware/auth.middleware.js';

const likeRouter = express.Router();

likeRouter.post('/:postId', checkLogin, like);

export default likeRouter;
