import express from 'express';
import {
    followUser,
    unfollowUser,
    getFollowingList,
    getFollowersList,
    getFollowingStatus
} from '../controllers/follow.js';
import { checkLogin } from '../middlewares/auth.middleware.js';

const followRouter = express.Router();

followRouter.post('/follow/:id', checkLogin, followUser);
followRouter.post('/unfollow/:id', checkLogin, unfollowUser);
followRouter.get('/following', checkLogin, getFollowingList);
followRouter.get('/follwers', checkLogin, getFollowersList);
followRouter.get('/following-status/:id', checkLogin, getFollowingStatus);

export default followRouter;
