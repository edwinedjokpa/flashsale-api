import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(3, 'firstName must be at least 3 characters long')
    .max(30, 'firstName must be less than or equal to 30 characters long'),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(3, 'lastName must be at least 3 characters long')
    .max(30, 'lastName must be less than or equal to 30 characters long'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'password must be at least 6 characters long')
    .max(20, 'password must be no longer than 20 characters long'),
});

export const loginUserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('please provide a valid email address'),
  password: z.string({ required_error: 'Password is required' }),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
