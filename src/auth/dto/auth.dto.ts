import { z } from "zod";

// Schema for creating a new user
export const createUserSchema = z.object({
  first_name: z
    .string()
    .min(3, "first_name must be at least 3 characters long")
    .max(30, "first_name must be less than or equal to 30 characters long"),
  last_name: z
    .string()
    .min(3, "last_name must be at least 3 characters long")
    .max(30, "last_name must be less than or equal to 30 characters long"),
  email: z.string().email("please provide a valid email address"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(20, "password must be no longer than 20 characters long"),
});

// Schema for logging in a user
export const loginUserSchema = z.object({
  email: z
    .string()
    .email("invalid email format. Please enter a valid email address"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(20, "password must be no longer than 20 characters long"),
});

// Inferred Types from the Zod Schemas
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
