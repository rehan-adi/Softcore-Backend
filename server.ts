import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import hpp from 'hpp';
import xss from 'xss-clean';
import helmet from 'helmet';
import morgan from 'morgan';
import ratelimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';
import passport from './config/passport.js';
import errorMiddleware from './middleware/errorMiddleware.js'

import authRouter from './routes/auth.routes.js';
import blogRouter from './routes/blog.routes.js';
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';
import profileRouter from './routes/profile.routes.js';
import searchRouter from './routes/search.routes.js';
import followRouter from './routes/follow.routes.js';
import paymentRoute from './routes/payment.routes.js';

// env config
env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();

// Database connection
dbConnect();

// Rate limiting configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

// Rate limiting configuration
const limit = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware's
server.use(express.json());
server.use(cookieParser());
server.use(cors(corsOptions));
server.use(helmet());
server.use(hpp());
server.use(xss());
server.use(mongoSanitize());
server.use(morgan('dev'));
server.use(limit);
server.use('/uploads', express.static(join(__dirname, 'uploads')));

// Disabling 'X-Powered-By' header for security reasons
server.disable('x-powered-by');

// Initialize passport
server.use(passport.initialize());

// Routes
server.use('/api/auth', authRouter);
server.use('/api/blogs', blogRouter);
server.use('/api/comments', commentRouter);
server.use('/api/likes', likeRouter);
server.use('/api/profile', profileRouter);
server.use('/api/search', searchRouter);
server.use('/api/user', followRouter);
server.use('/api/payment', paymentRoute);

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ success: true });
});

// Handle Undefined Routes
app.all('*', (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server!`);
    error.status = 404;
    next(error);
});

// Error handling middleware
server.use(errorMiddleware);

server.listen(process.env.PORT || 3333, () => {
    console.log(`Server listening on ${process.env.PORT}`);
});