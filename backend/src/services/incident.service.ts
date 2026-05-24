import type { FastifyInstance } from "fastify";
import type { IncidentBody } from "../schemas/incident.schema.js"; // Clean inferred type
export const addIncidentService = async (
  input: IncidentBody,
  app: FastifyInstance,
  userId: string,
) => {
  try {
    const incident = await app.prisma.incident.create({
      data: {
        title: input.title,
        description: input.description,
        severity: input.severity,
        status: input.status,
        userId,
      },
    });
    return incident;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Database operation failed";
    throw new Error(errorMessage);
  }
};
export const getIncidentService = async (app: FastifyInstance) => {
  try {
    const data = await app.prisma.incident.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        userId: true,
      },
    });
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";
    throw new Error(errorMessage);
  }
};
export const getIncidentByIdService = async (
  id: string,
  app: FastifyInstance,
) => {
  try {
    const data = await app.prisma.incident.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        userId: true,
      },
    });

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";
    throw new Error(errorMessage);
  }
};
