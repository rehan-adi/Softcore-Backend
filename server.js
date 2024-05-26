import express from 'express';
import env from 'dotenv'
import cors from 'cors'
import dbConnect from './config/dbConnect.js';

env.config();

const server = express();


// database connection
dbConnect();


// Middleware's 
server.use(express.json());
server.use(cors());


server.listen(process.env.PORT || 3333, () => {
    console.log(`Server listening on ${process.env.PORT}`);
})