import type { FastifyInstance } from "fastify";
import { login, signup } from "../controllers/auth.controller.js";
export async function authUser(app: FastifyInstance) {
  app.post("/signup", signup);
  app.post("/login", login);
}
