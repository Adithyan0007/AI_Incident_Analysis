import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authUser } from "./routes/auth.routes.js";
import { prismaPlugin } from "./plugins/prisma.js";
import { authenticate } from "./plugins/authenticate.js";
import { DeploymentRoute } from "./routes/deployment.routes.js";
import { metricRoute } from "./routes/metric.routes.js";

import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { incidentRoute } from "./routes/incident.routes.js";
import { LogRoute } from "./routes/logs.routes.js";

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
// Run these once in your main entry file!
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.after(() => {
  app.get("/health", { preHandler: [app.authenticate] }, async () => {
    return { status: "ok" };
  });
});

app.register(authUser, { prefix: "/auth" });
app.register(incidentRoute, { prefix: "/incident" });
app.register(LogRoute, { prefix: "/log" });
app.register(DeploymentRoute, { prefix: "/deployments" });
app.register(metricRoute, { prefix: "/metric" });
