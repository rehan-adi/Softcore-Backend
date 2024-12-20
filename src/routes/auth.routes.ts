import express from 'express';
import passport from 'passport';
import { checkLogin } from '../middlewares/auth.middleware.js';
import { signup, signin, logout, changePassword, deleteAccount } from '../controllers/auth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/logout', logout);
authRouter.put('/change-password', checkLogin, changePassword);
authRouter.delete('/delete-account', checkLogin, deleteAccount);

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
        res.redirect(`https://softcoreapp.vercel.app/google/callback/?token=${token}`);
    }
);

export default authRouter;
