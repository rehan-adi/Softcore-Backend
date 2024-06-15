import express from 'express';
import env from 'dotenv'
import cors from 'cors'
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';
import passport from './config/passport.js'

import authRouter from './routes/auth.routes.js';
import blogRouter from './routes/blog.routes.js';
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';
import profileRouter from './routes/profile.routes.js';
import searchRouter from './routes/search.routes.js';
import followRouter from './routes/follow.routes.js';
import paymentRoute from './routes/payment.routes.js';

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();

// database connection
dbConnect();


// CORS options
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  };


// Middleware's
server.use(cookieParser()); 
server.use(express.json());
server.use(cors(corsOptions));
server.use('/uploads', express.static(join(__dirname, 'uploads')));

// Initialize passport
server.use(passport.initialize());

// routes 
server.use('/api/auth', authRouter);
server.use('/api/blogs', blogRouter);
server.use('/api/comments', commentRouter);
server.use('/api/likes', likeRouter);
server.use('/api/profile', profileRouter);
server.use('/api/search', searchRouter);
server.use('/api/user', followRouter);
server.use('/api/payment', paymentRoute);

server.listen(process.env.PORT || 3333, () => {
    console.log(`Server listening on ${process.env.PORT}`);
})