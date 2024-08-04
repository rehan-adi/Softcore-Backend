import { z } from 'zod';

// Define validation schema for Sign up
export const signupValidation = z.object({
    username: z
        .string()
        .min(1, { message: 'username is required' })
        .transform((val) => val.trim()),
    fullname: z
        .string()
        .min(1, { message: 'fullname is required' })
        .transform((val) => val.trim()),
    email: z
        .string()
        .email({ message: 'Invalid email address format' })
        .transform((val) => val.trim().toLowerCase()),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .regex(/[A-Z]/, {
            message: 'Password must contain at least one uppercase letter'
        })
        .regex(/[a-z]/, {
            message: 'Password must contain at least one lowercase letter'
        })
        .regex(/[0-9]/, {
            message: 'Password must contain at least one number'
        })
        .regex(/[\W_]/, {
            message: 'Password must contain at least one special character'
        }),
    profilePicture: z.string().optional(),
    bio: z.string().optional()
});

// Define validation schema for Sign in
export const signinValidation = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email address format' })
        .transform((val) => val.trim().toLowerCase()),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .regex(/[A-Z]/, {
            message: 'Password must contain at least one uppercase letter'
        })
        .regex(/[a-z]/, {
            message: 'Password must contain at least one lowercase letter'
        })
        .regex(/[0-9]/, {
            message: 'Password must contain at least one number'
        })
        .regex(/[\W_]/, {
            message: 'Password must contain at least one special character'
        })
});
