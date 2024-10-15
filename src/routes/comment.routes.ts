import express from 'express';
import {
    createComment,
    getComments,
    updateComment,
    deleteComments
} from '../controllers/comment.js';
import { checkLogin } from '../middlewares/auth.middleware.js';

const commentRouter = express.Router();

commentRouter.post('/post/:postId', checkLogin, createComment);
commentRouter.get('/:postId', getComments);
commentRouter.patch('/:commentId', checkLogin, updateComment);
commentRouter.delete('/:commentId', checkLogin, deleteComments);

export default commentRouter;
