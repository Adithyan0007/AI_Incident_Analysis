import type { FastifyInstance } from "fastify";

export const getDeploymentTool = async (
  incidentTime: Date,
  app: FastifyInstance,
) => {
  try {
    const deployment = await app.prisma.deployment.findFirst({
      where: {
        deployedAt: {
          lte: incidentTime,
        },
      },
      orderBy: {
        deployedAt: "desc",
      },
    });
    return deployment;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database Operation Failed";
    throw new Error(errorMessage);
  }
};
