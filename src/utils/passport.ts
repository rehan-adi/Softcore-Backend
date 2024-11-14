import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config.js';
import userModel from '../models/user.model.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ googleId: profile.id });

                if (!user) {
                    const email = (profile.emails && profile.emails[0].value) || '';
                    const profilePicture = (profile.photos && profile.photos[0].value) || '';
                    const fullname = profile.displayName;

                    user = new userModel({
                        googleId: profile.id,
                        username: profile.displayName,
                        email,
                        profilePicture,
                        fullname
                    });
                    await user.save();
                }

                const payload = { id: user.id };
                const token = jwt.sign(payload, config.JWT_SECRET, {
                    expiresIn: '24h'
                });

                done(null, { id: user.id, username: user.username, token });
            } catch (err) {
                done(err, false);
            }
        }
    )
);

export default passport;
