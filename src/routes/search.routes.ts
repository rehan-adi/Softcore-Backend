import express from 'express';
import { searchUsers } from '../controllers/search.js';

const searchRouter = express.Router();

searchRouter.get('/user', searchUsers);
// searchRouter.get('/post', searchPosts);

export default searchRouter;
