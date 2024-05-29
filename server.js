import express from 'express';
import env from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';

import authRouter from './routes/auth.routes.js';
import blogRouter from './routes/blog.routes.js';

env.config();
const server = express();

// database connection
dbConnect();


// Middleware's
server.use(cookieParser()); 
server.use(express.json());
server.use(cors());

// routes 
server.use('/api', authRouter);
server.use('/blog', blogRouter);

server.listen(process.env.PORT || 3333, () => {
    console.log(`Server listening on ${process.env.PORT}`);
})