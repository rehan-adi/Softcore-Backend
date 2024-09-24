import * as express from 'express';

declare global {
    namespace Express {
        interface User {
            id: string;
            token: string;
        }
        interface Request {
            user?: User;
        }
    }
}