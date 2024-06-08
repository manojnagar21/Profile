// src/config/config.ts
import dotenv from 'dotenv';

dotenv.config();

export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
export const REDIS_PORT = process.env.REDIS_PORT || '6379';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

export const MONGODB_HOST = process.env.MONGODB_HOST || '127.0.0.1';
export const MONGODB_PORT = process.env.MONGODB_PORT || '27017';
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'profile';
export const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';

export const PORT = process.env.PORT || 3000;

// export const JWT_SECRET = process.env.JWT_SECRET;
// export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;