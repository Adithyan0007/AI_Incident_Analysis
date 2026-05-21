import fp from "fastify-plugin";
import type { FastifyRequest, FastifyReply } from "fastify";
export const authenticate = fp(async (app) => {
  app.decorate(
    "authenticate",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        await req.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          message: "Unauthorized",
        });
      }
    },
  );
});
