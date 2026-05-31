import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { SimulationController } from "../controllers/simulation.controller.js";
import { simulateScenarioSchema } from "../schemas/simulation.schema.js";
export const SimulationRoute = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/",
      { schema: simulateScenarioSchema, preHandler: [app.authenticate] },
      SimulationController,
    );
};
