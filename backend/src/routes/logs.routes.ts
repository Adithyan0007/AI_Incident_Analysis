import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  PostLogController,
  GetLogController,
} from "../controllers/log.controller.js";
import { getLogQuerySchema, logSchema } from "../schemas/log.schema.js";
export const LogRoute = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/",
      { schema: logSchema, preHandler: [app.authenticate] },
      PostLogController,
    );
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/",
      {
        schema: { querystring: getLogQuerySchema },
        preHandler: [app.authenticate],
      },
      GetLogController,
    );
};
