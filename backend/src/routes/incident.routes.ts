import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  addIncident,
  getIncident,
  getIncidentById,
} from "../controllers/incident.controller.js";
import { addIncidentSchema } from "../schemas/incident.schema.js"; // Import your schema

export const incidentRoute = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/",
      { schema: addIncidentSchema, preHandler: [app.authenticate] },
      addIncident,
    );
  app.get("/", getIncident);
  app.get("/:id", getIncidentById);
};
