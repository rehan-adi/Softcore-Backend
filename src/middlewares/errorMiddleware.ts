import { NextFunction, Request, Response } from 'express';

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
};

export default errorHandler;
