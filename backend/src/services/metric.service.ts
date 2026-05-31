import type { FastifyInstance } from "fastify";
import type {
  GetMetricQuery,
  MetricSchema,
} from "../schemas/metrich.schema.js";
import { Prisma } from "../generated/prisma/index.js";
export const postMetricService = async (
  input: MetricSchema,
  app: FastifyInstance,
) => {
  try {
    const data = await app.prisma.metric.create({
      data: {
        service: input.service,
        metricName: input.metricName,
        value: input.value,
        timestamp: input.timestamp ? new Date(input.timestamp) : new Date(),
      },
    });
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";
    throw new Error(errorMessage);
  }
};
export const getMetricService = async (
  query: GetMetricQuery,
  app: FastifyInstance,
) => {
  try {
    const where: Prisma.MetricWhereInput = {};
    if (query.service) {
      where.service = query.service;
    }
    if (query.metricName) {
      where.metricName = query.metricName;
    }
    const options: Prisma.MetricFindManyArgs = {
      where,
      orderBy: {
        timestamp: "desc",
      },
    };
    if (query.limit) {
      options.take = query.limit;
    }
    const data = await app.prisma.metric.findMany(options);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";
    throw new Error(errorMessage);
  }
};
