import { z } from "zod";

export const commentValidation = z.object({
    content: z
        .string()
        .min(1, { message: "Comment cannot be empty" })
        .max(100, { message: "Comment cannot exceed 100 characters" })
        .trim()
        .refine(
            (val) => !/^\s+$/.test(val), 
            { message: "Comment cannot be just spaces" }
        )
});
