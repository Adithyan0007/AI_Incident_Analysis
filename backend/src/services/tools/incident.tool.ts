import type { FastifyInstance } from "fastify";

export const getIncidentTool = async (
  incidentId: string,
  app: FastifyInstance,
) => {
  try {
    const incident = await app.prisma.incident.findUnique({
      where: {
        id: incidentId,
      },
    });
    return incident;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database Operation Failed";
    throw new Error(errorMessage);
  }
};
