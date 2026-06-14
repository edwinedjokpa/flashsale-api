import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z
    .string()
    .min(3, 'firstName must be at least 3 characters long')
    .max(30, 'firstName must be less than or equal to 30 characters long'),
  lastName: z
    .string()
    .min(3, 'lastName must be at least 3 characters long')
    .max(30, 'lastName must be less than or equal to 30 characters long'),
  email: z.string().email('please provide a valid email address'),
  password: z
    .string()
    .min(6, 'password must be at least 6 characters long')
    .max(20, 'password must be no longer than 20 characters long'),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .email('invalid email format. Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'password must be at least 6 characters long')
    .max(20, 'password must be no longer than 20 characters long'),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
