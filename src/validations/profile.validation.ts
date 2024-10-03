import { z } from 'zod';

export const updateProfileValidation = z.object({
    username: z
        .string()
        .min(2, 'Username must be at least 2 characters long')
        .max(20, 'Username must be at most 20 characters long')
        .optional(),
    bio: z
        .string()
        .min(10, 'Bio must be at least 10 characters long')
        .max(200, 'Bio must be at most 200 characters long')
        .optional(),
    image: z.string().optional()
});
