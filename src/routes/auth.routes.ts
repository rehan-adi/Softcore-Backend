import express from 'express';
import passport from 'passport';
import { signup, signin, logout } from '../controllers/auth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/logout', logout);

// Google OAuth routes
authRouter.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);
authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/error',
        session: false
    }),
    (req, res) => {
        const token = req.user?.token;
        res.redirect(`/?token=${token}`);
    }
);

export default authRouter;
