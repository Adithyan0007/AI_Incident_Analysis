import { z } from "zod";
export const signupSchema = {
  body: z.object({
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters" }),
    role: z.enum(["USER", "ADMIN"], {
      error: "Role must be either USER or ADMIN",
    }),
    name: z.string().min(2, { error: "Name must be at least 2 characters" }),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(1, { error: "Password is required" }),
  }),
};

// 3. REPLACES YOUR MANUAL TYPES: Zod automatically creates them right here!
export type SignUpInput = z.infer<typeof signupSchema.body>;
export type LoginInput = z.infer<typeof loginSchema.body>;
