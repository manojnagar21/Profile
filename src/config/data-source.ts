// src/config/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_USERNAME, MONGODB_PASSWORD } from './config';

export const AppDataSource = new DataSource({
    type: 'mongodb',
    host: MONGODB_HOST,
    port: parseInt(MONGODB_PORT, 10),
    database: MONGODB_DATABASE,
    username: MONGODB_USERNAME,
    password: MONGODB_PASSWORD,
    useUnifiedTopology: true,
    synchronize: true,
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [],
});