import express from 'express';
import env from 'dotenv'
import cors from 'cors'
import dbConnect from './config/dbConnect.js';

import authRouter from './routes/auth.routes.js';

env.config();

const server = express();

// database connection
dbConnect();


// Middleware's 
server.use(express.json());
server.use(cors());

// routes 
server.use('/api', authRouter)

server.listen(process.env.PORT || 3333, () => {
    console.log(`Server listening on ${process.env.PORT}`);
})