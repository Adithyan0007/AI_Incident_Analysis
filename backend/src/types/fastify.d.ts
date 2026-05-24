import type { PrismaClient } from "../generated/prisma/index.js";
import "@fastify/jwt";
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      userId: string;
      email: string;
      role: string;
    };
  }
}
