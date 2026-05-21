import type { FastifyReply, FastifyRequest } from "fastify";
import { loginUser, signupUser } from "../services/auth.services.js";
type LoginBody = {
  email: string;
  password: string;
};
type SignupBody = {
  email: string;
  password: string;
  name: string;
  role: string;
};
export async function login(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  const result = await loginUser(request.body, request.server);

  return reply.send(result);
}
export async function signup(
  request: FastifyRequest<{ Body: SignupBody }>,
  reply: FastifyReply,
) {
  try {
    const user = await signupUser(request.body, request.server);
    return reply.send(user);
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }
}
