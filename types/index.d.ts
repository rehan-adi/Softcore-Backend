import * as express from 'express';

declare global {
    namespace Express {
        interface User {
            token: string;
        }
        interface Request {
            user?: User;
        }
    }
}