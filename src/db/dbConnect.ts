import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });
        console.log('Database connected');
    } catch (error) {
        console.error(`DB Connection Failed`, error);
        process.exit(1);
    }
};

export default dbConnect;
