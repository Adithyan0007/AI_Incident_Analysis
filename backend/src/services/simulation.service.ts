import type { FastifyInstance } from "fastify";
import type { SimulateScenarioBody } from "../schemas/simulation.schema.js";
export const SimulationService = async (
  input: SimulateScenarioBody,
  app: FastifyInstance,
  userId: string,
) => {
  try {
    const deployment = await app.prisma.deployment.create({
      data: {
        service: input.deployment.service,
        version: input.deployment.version,
        status: input.deployment.status,
        commitHash: input.deployment.commitHash ?? null,
        deployedAt: new Date(input.deployment.deployedAt),
      },
    });
    const metric = await app.prisma.metric.createMany({
      data: input.metrics.map((metric) => ({
        service: metric.service,
        metricName: metric.metricName,
        value: metric.value,
        timestamp: new Date(metric.timestamp),
      })),
    });
    const logs = await app.prisma.log.createMany({
      data: input.logs.map((log) => ({
        service: log.service,
        level: log.level,
        message: log.message,
        timestamp: new Date(log.timestamp),
      })),
    });

    const incident = await app.prisma.incident.create({
      data: {
        title: input.incident.title,
        description: input.incident.description ?? null,
        severity: input.incident.severity,
        status: input.incident.status,
        userId: userId,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database Operation Failed";
    throw new Error(errorMessage);
  }
};
