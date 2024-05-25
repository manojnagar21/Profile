import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import app from './index';
import { PORT } from './config/config';

AppDataSource.initialize().then(() => {
    console.log('Connected to the database');

    // No need to connect here, the client should connect once in the singleton pattern
    // const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log('Database connection error:', error));