import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  GetDeploymentController,
  PostDeploymentController,
} from "../controllers/deployment.controller.js";
import {
  deploymentSchema,
  getDeploymentQuerySchema,
} from "../schemas/deployment.schema.js";

export const DeploymentRoute = async (app: FastifyInstance) => {
  // POST Route - Clean and correct
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/",
      { schema: deploymentSchema, preHandler: [app.authenticate] },
      PostDeploymentController,
    );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        querystring: getDeploymentQuerySchema,
        preHandler: [app.authenticate], // Assigning the schema value directly
      },
    },
    GetDeploymentController, // The handler sits cleanly as the final argument
  );
};
