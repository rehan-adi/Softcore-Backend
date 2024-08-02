import env from 'dotenv'

env.config();

interface Config {
    PORT: number;
    MONGODB_URI: string;
    DB_NAME: string;
    CORS_ORIGIN: string;
    JWT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
}

const config: Config = {
    PORT: parseInt(process.env.PORT || '3333', 10),
    MONGODB_URI: process.env.MONGO_URI as string,
    DB_NAME: process.env.DB_NAME as string,
    CORS_ORIGIN: process.env.CORS_ORIGIN as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
}

export default config