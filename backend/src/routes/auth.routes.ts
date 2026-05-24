import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { login, signup } from "../controllers/auth.controller.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";
export async function authUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/signup", { schema: signupSchema }, signup);
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/login", { schema: loginSchema }, login);
}
