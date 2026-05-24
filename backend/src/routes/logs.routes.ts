import type { FastifyInstance } from "fastify";
import {
  PostLogController,
  GetLogController,
} from "../controllers/log.controller.js";
import { logSchema } from "../schemas/log.schema.js";
export const LogRoute = async (app: FastifyInstance) => {
  app.post("/", { schema: logSchema }, PostLogController);
  app.get("/", GetLogController);
};
