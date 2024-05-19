// src/schemas/userSchema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
});

export const getUserSchema = z.object({
    id: z.string().min(1, 'ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});