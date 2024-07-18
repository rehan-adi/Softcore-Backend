import jwt from 'jsonwebtoken';

export const checkLogin = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required. Please login.'
            });
        }

        try {
            const decoded = jwt.verify(
                token.replace('Bearer ', ''),
                process.env.JWT_SECRET
            );
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
            error: error.message
        });
    }
};
