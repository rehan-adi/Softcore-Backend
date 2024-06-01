import express from 'express';
import env from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';

import authRouter from './routes/auth.routes.js';
import blogRouter from './routes/blog.routes.js';
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';

env.config();
const server = express();

// database connection
dbConnect();


// Middleware's
server.use(cookieParser()); 
server.use(express.json());
server.use(cors());

// routes 
server.use('/api/auth', authRouter);
server.use('/api/blogs', blogRouter);
server.use('/api/comments', commentRouter);
server.use('/api/likes', likeRouter);

server.listen(process.env.PORT || 3333, () => {
    console.log(`Server listening on ${process.env.PORT}`);
})