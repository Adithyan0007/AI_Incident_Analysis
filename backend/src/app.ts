import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authUser } from "./routes/auth.routes.js";
import { prismaPlugin } from "./plugins/prisma.js";
import { authenticate } from "./plugins/authenticate.js";
// import { userRoutes } from "./routes/user.routes.js";
export const app = Fastify({ logger: true });

app.register(authenticate);
app.register(cors, {
  origin: true,
});
app.register(jwt, {
  secret: process.env.JWT_SECRET || "dev_secret",
});
app.register(prismaPlugin);
app.after(() => {
  app.get("/health", { preHandler: [app.authenticate] }, async () => {
    return { status: "ok" };
  });
});

app.register(authUser, { prefix: "/auth" });
