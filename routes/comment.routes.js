import express from 'express';
import {createComment, getAllComments, updateComment, deleteComments} from '../controllers/comment.js'

const commentRouter = express.Router();

commentRouter.post('/post/:postId/comments', createComment);
commentRouter.get('/allcomments', getAllComments);
commentRouter.patch('/:commentId', updateComment);
commentRouter.delete('/:commentId', deleteComments);


export default commentRouter;