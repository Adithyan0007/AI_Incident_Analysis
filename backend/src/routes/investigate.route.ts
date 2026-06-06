import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { investigateIncidentSchema } from "../schemas/investigate.incident.schema.js";
import { InvestigateController } from "../controllers/investigate.controller.js";
import { InvestigateStreamController } from "../controllers/investigate.streamcontroller.js";
export const InvestigateRoute = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/",
      { schema: investigateIncidentSchema, preHandler: [app.authenticate] },
      InvestigateController,
    );
  app.withTypeProvider<ZodTypeProvider>().post(
    "/stream",
    {
      schema: investigateIncidentSchema,
      preHandler: [app.authenticate],
    },
    InvestigateStreamController,
  );
};
