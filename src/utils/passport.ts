import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import config from '../config/config.js';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET, // Fix this line
            callbackURL: 'http://localhost:3333/api/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ googleId: profile.id });

                if (!user) {
                    const email = (profile.emails && profile.emails[0].value) || '';
                    const profilePicture = (profile.photos && profile.photos[0].value) || '';

                    user = new userModel({
                        googleId: profile.id,
                        username: profile.displayName,
                        email,
                        profilePicture
                    });
                    await user.save();
                }

                const payload = { id: user.id }; // Ensure user.id is correctly defined
                const token = jwt.sign(payload, config.JWT_SECRET, {
                    expiresIn: '1h'
                });

                // Pass only the necessary user data along with the token
                done(null, { id: user.id, username: user.username, token });
            } catch (err) {
                done(err, false);
            }
        }
    )
);

export default passport;
