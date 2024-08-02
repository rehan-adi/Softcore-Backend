import app from './app.js';
import config from './config/config.js';
import dbConnect from './db/dbConnect.js';

// database connection
dbConnect()
    .then(() => {
        app.listen(config.PORT, () => {
            console.log(`Server is running at port ${config.PORT}...`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });
