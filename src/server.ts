import app from './app.js';
import dbConnect from './db/dbConnect.js';

// database connection
dbConnect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at port ${process.env.PORT}...`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });