import type { FastifyReply, FastifyRequest } from "fastify";
import {
  logSchema,
  type LogQuerySchema,
  type LogSchema,
} from "../schemas/log.schema.js";
import { GetLogService, PostLogService } from "../services/log.service.js";
export const PostLogController = async (
  req: FastifyRequest<{ Body: LogSchema }>,
  reply: FastifyReply,
) => {
  try {
    const data = await PostLogService(req.body, req.server);
    reply.send("Log added successfully");
  } catch (err) {
    if (err instanceof Error) {
      reply.status(400).send({
        message: err.message,
      });
    }
  }
};
export const GetLogController = async (
  req: FastifyRequest<{ Querystring: LogQuerySchema }>,
  reply: FastifyReply,
) => {
  try {
    const data = await GetLogService(req.server, req.query);
    reply.send(data);
  } catch (err) {
    if (err instanceof Error) {
      reply.status(400).send({
        message: err.message,
      });
    }
  }
};
