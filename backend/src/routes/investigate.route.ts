import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { investigateIncidentSchema } from "../schemas/investigate.incident.schema.js";
import { InvestigateController } from "../controllers/investigate.controller.js";
export const InvestigateRoute = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/",
      { schema: investigateIncidentSchema, preHandler: [app.authenticate] },
      InvestigateController,
    );
};
