import type {
  GetMetricQuery,
  MetricSchema,
} from "../schemas/metrich.schema.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  postMetricService,
  getMetricService,
} from "../services/metric.service.js";

export const postMetricController = async (
  req: FastifyRequest<{ Body: MetricSchema }>,
  reply: FastifyReply,
) => {
  try {
    const data = await postMetricService(req.body, req.server);
    return reply.send(data);
  } catch (error) {
    if (error instanceof Error) {
      reply.status(401).send({
        message: error.message,
      });
    }
  }
};

export const getMetricController = async (
  req: FastifyRequest<{ Querystring: GetMetricQuery }>,
  reply: FastifyReply,
) => {
  const data = await getMetricService(req.query, req.server);
  return reply.send(data);
};
