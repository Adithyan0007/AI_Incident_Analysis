import type { FastifyReply, FastifyRequest } from "fastify";
import { loginUser, signupUser } from "../services/auth.services.js";
import type { SignUpInput, LoginInput } from "../schemas/auth.schema.js";

export async function login(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) {
  try {
    const result = await loginUser(request.body, request.server);

    return reply.send(result);
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({
        message: error.message,
      });
    }
  }
}
export async function signup(
  request: FastifyRequest<{ Body: SignUpInput }>,
  reply: FastifyReply,
) {
  try {
    const user = await signupUser(request.body, request.server);
    return reply.send(user);
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({
        message: error.message,
      });
    }
  }
}
