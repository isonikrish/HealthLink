import { z } from "zod";
export const signupSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["patient", "doctor"], "Invalid role"),
  profilePic: z.string().optional(),
  gender: z.enum(["male", "female", "other"], "Invalid gender"),
  address: z.string(),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export const appointmentSchema = z.object({
  doctorId: z.string(),
  description: z.string(),
  date: z.string(),
  timeFrom: z.string(),
  timeTo: z.string(),
});
