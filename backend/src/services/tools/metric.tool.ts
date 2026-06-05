import type { FastifyInstance } from "fastify";

export const getMetricTool = async (
  service: string,
  deploymentTime: Date,
  app: FastifyInstance,
) => {
  try {
    const metrics = await app.prisma.metric.findMany({
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
    return metrics;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database Operation Failed";
    throw new Error(errorMessage);
  }
};
