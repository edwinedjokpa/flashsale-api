import { z } from 'zod';

// Schema for logging in a user
export const loginUserSchema = z.object({
  email: z
    .string()
    .email('invalid email format. Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'password must be at least 6 characters long')
    .max(20, 'password must be no longer than 20 characters long'),
});

// Inferred Types from the Zod Schemas
export type LoginUserDto = z.infer<typeof loginUserSchema>;
