import { z } from 'zod';

export const createPostValidation = z.object({
    content: z
        .string()
        .optional(),
    tags: z.array(z.string()).optional(),
    category: z
        .string()
        .optional()
});

export const updatePostValidation = z.object({
    content: z
        .string()
        .min(1, { message: 'Content should have at least 1 characters' })
        .transform((val) => val.trim()),
});