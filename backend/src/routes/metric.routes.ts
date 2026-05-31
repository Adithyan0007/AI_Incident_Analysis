import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  postMetricController,
  getMetricController,
} from "../controllers/metric.controller.js";
import {
  getMetricQuerySchema,
  metricSchema,
} from "../schemas/metrich.schema.js";

// IMPROVED: Added async declaration for modern Fastify standards
export const metricRoute = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/",
      { schema: metricSchema, preHandler: [app.authenticate] },
      postMetricController,
    );
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: { querystring: getMetricQuerySchema },
      preHandler: [app.authenticate],
    },
    getMetricController,
  );
};
