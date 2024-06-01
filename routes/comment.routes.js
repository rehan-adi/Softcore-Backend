import express from 'express';
import {createComment, getAllComments, updateComment, deleteComments} from '../controllers/comment.js'

const commentRouter = express.Router();

commentRouter.post('/post/:postId/comments', createComment);
commentRouter.get('/post/allcomments', getAllComments);
commentRouter.patch('/post/:postId', updateComment);
commentRouter.patch('/post/:postId', deleteComments);


export default commentRouter;