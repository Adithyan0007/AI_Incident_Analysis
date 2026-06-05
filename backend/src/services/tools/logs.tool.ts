import type { FastifyInstance } from "fastify";

export const getLogsTool = async (
  service: string,
  deploymentTime: Date,
  app: FastifyInstance,
) => {
  try {
    const logs = await app.prisma.log.findMany({
      where: {
        timestamp: {
          gte: deploymentTime,
        },
        service: service,
      },
      orderBy: {
        timestamp: "asc",
      },
    });
    return logs;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database Operation Failed";
    throw new Error(errorMessage);
  }
};
