import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(6, "Username must be at least 6 characters")
    .toLowerCase(),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please provide a valid email")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must be at least 1 uppercase")
    .regex(/[a-z]/, "Password must be at least 1 lowercase")
    .regex(/[0-9]/, "Password must be at least 1 number")
    .regex(/[^A-Za-z0-9]/, "Password must be at least 1 special character"),
  firstName: z.string().trim().min(1, "FirstName is required"),
  lastName: z.string().trim().min(1, "LastName is required"),
});

export const signinSchema = z.object({
  username: z.string().trim().min(1, "Username is required").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});
