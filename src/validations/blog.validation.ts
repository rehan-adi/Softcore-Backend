import { z } from 'zod';

export const createBlogValidation = z.object({
    content: z
        .string()
        .min(1, { message: 'Content should have at least 1 characters' })
        .transform((val) => val.trim()),
    tags: z.array(z.string()).optional(),
    category: z
        .string()
        .min(1, { message: 'Category is required' })
        .transform((val) => val.trim())
});
