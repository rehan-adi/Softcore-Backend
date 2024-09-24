import { z } from 'zod';

export const signupValidation = z.object({
    username: z
        .string()
        .min(2, 'Username must be at least 2 characters')
        .max(20, 'Username must be at most 20 characters'),
    fullname: z
        .string()
        .min(2, 'Full Name must be at least 2 characters')
        .max(20, 'Full Name must be at most 20 characters'),
    email: z
        .string()
        .email('Invalid email address')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(15, 'Password must be at most 15 characters'),
    profilePicture: z.string().optional(),
});

export const signinValidation = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(15, 'Password must be at most 15 characters')
});