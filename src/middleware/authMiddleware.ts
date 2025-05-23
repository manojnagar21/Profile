// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({message: "aaaaaaa"});

    jwt.verify(token, JWT_SECRET, (err: any, token: any) => {

        if (err) return res.sendStatus(403);
        req.user = token as { userId: string };
        next();
    });
};