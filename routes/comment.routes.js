import express from 'express';
import {createComment, getAllComments} from '../controllers/comment.js'

const commentRouter = express.Router();

commentRouter.post('/post/:postId/comments', createComment);
commentRouter.get('/allcomments', getAllComments);


export default commentRouter;