import { z } from 'zod';

export const updateProfileValidation = z.object({
    username: z.string().optional(),
    bio: z.string().optional(),
    image: z.string().optional(),
});
