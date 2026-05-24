import type { FastifyInstance } from "fastify";
import type { LogQuerySchema, LogSchema } from "../schemas/log.schema.js";
import { Prisma } from "../generated/prisma/index.js";
export const PostLogService = async (
  input: LogSchema,
  app: FastifyInstance,
) => {
  try {
    const log = await app.prisma.log.create({
      data: {
        service: input.service,
        message: input.message,
        level: input.level,
      },
    });
    return log;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";
    throw new Error(errorMessage);
  }
};
export const GetLogService = async (
  app: FastifyInstance,
  query: LogQuerySchema,
) => {
  try {
    const where: Prisma.LogWhereInput = {};

    if (query.service) {
      where.service = query.service;
    }

    if (query.level) {
      where.level = query.level;
    }

    const options: Prisma.LogFindManyArgs = {
      where,
      orderBy: {
        timestamp: "desc",
      },
    };
    if (query.limit) {
      options.take = query.limit;
    }

    const logs = await app.prisma.log.findMany(options);
    return logs;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";
    throw new Error(errorMessage);
  }
};
