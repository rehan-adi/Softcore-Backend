import express from 'express';
import {
  followUser,
  unfollowUser,
  getFollowingList,
  getFollowersList,
} from '../controllers/follow.js';
import { checkLogin } from '../middleware/auth.middleware.js';

const followRouter = express.Router();

followRouter.post('/follow/:id', checkLogin, followUser);
followRouter.post('/unfollow/:id', checkLogin, unfollowUser);
followRouter.get('/following', checkLogin, getFollowingList);
followRouter.get('/follwers', checkLogin, getFollowersList);

export default followRouter;
