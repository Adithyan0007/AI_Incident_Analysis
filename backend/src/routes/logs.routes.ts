import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  PostLogController,
  GetLogController,
} from "../controllers/log.controller.js";
import { logSchema } from "../schemas/log.schema.js";
export const LogRoute = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/", { schema: logSchema }, PostLogController);
  app.get("/", GetLogController);
};
