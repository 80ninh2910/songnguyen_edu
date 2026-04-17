import { z } from "zod";

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const TutorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const LogoutSchema = z.object({
  refreshToken: z.string().min(10),
});
