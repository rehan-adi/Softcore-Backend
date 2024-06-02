import express from 'express';
import {createComment, getAllComments, updateComment, deleteComments} from '../controllers/comment.js'
import {checkLogin} from '../middleware/auth.middleware.js'

const commentRouter = express.Router();

commentRouter.post('/post/:postId/comments', checkLogin, createComment);
commentRouter.get('/allcomments', getAllComments);
commentRouter.patch('/:commentId', checkLogin, updateComment);
commentRouter.delete('/:commentId', checkLogin, deleteComments);


export default commentRouter;