import { z } from 'zod';

// Define validation schema for creating a blog
export const createBlogValidation = z.object({
    title: z
        .string()
        .max(100, { message: 'Title cannot exceed 100 characters' })
        .transform((val) => val.trim()),
    content: z
        .string()
        .min(10, { message: 'Content should have at least 10 characters' })
        .transform((val) => val.trim()),
    tags: z.array(z.string()).optional(),
    category: z
        .string()
        .min(1, { message: 'Category is required' })
        .transform((val) => val.trim())
});
