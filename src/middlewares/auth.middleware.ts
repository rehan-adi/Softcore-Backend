import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config.js';

interface UserPayload extends JwtPayload {
    id: string;    
    token: string; 
}

declare global {
    namespace Express {
        interface User extends UserPayload {}
    }
}


export const checkLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token || req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required. Please login.'
            });
        }

        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), config.JWT_SECRET) as UserPayload;
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token. Please login again.'
            });
        }
    } catch (error) {
        console.error('Error during authentication check:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while validating the token.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
