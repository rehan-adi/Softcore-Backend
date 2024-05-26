import express from 'express';
import env from 'dotenv'
import dbConnect from './config/dbConnect.js';

env.config();

const server = express();

// database connection
dbConnect();


server.listen(process.env.PORT || 3333, () => {
    console.log(`Server listening on ${process.env.PORT}`);
})