// src/schemas/userSchema.ts
import { z } from 'zod';

const passwordSchema = z.string().min(8).max(100).regex(/[A-Z]/, 'must contain at least one uppercase letter')
    .regex(/[a-z]/, 'must contain at least one lowercase letter')
    .regex(/[0-9]/, 'must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'must contain at least one special character');

export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
});

export const getUserSchema = z.object({
    id: z.string().min(1, 'ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});