import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/Blog_user.model.js';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import config from '../config/config.js';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_ID,
            callbackURL: 'http://localhost:3333/api/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ googleId: profile.id });

                if (!user) {
                    user = new userModel({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        profilePicture: profile.photos[0].value
                    });
                    await user.save();
                }

                const payload = { id: user.id };
                const token = jwt.sign(payload, config.JWT_SECRET, {
                    expiresIn: '1h'
                });

                done(null, { user, token });
            } catch (err) {
                done(err, false);
            }
        }
    )
);

export default passport;
