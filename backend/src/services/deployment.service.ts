import type { FastifyInstance } from "fastify";
import type { Prisma } from "../generated/prisma/index.js";
import type {
  DeploymentSchema,
  GetDeploymentQuery,
} from "../schemas/deployment.schema.js";

export const PostDeploymentService = async (
  body: DeploymentSchema,
  app: FastifyInstance,
) => {
  try {
    const deployment = await app.prisma.deployment.create({
      data: {
        service: body.service,
        version: body.version,
        status: body.status,
        commitHash: body.commitHash ?? null,
        deployedAt: body.deployedAt
          ? new Date(body.deployedAt)
          : new Date(Date.now()),
      },
    });

    return deployment;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";

    throw new Error(errorMessage);
  }
};
export const GetDeploymentService = async (
  app: FastifyInstance,
  query: GetDeploymentQuery,
) => {
  try {
    const where: Prisma.DeploymentWhereInput = {};

    if (query.service) {
      where.service = query.service;
    }

    if (query.status) {
      where.status = query.status;
    }

    const options: Prisma.DeploymentFindManyArgs = {
      where,
      orderBy: {
        deployedAt: "desc",
      },
    };

    if (query.limit) {
      options.take = query.limit;
    }

    const deployments = await app.prisma.deployment.findMany(options);

    return deployments;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";

    throw new Error(errorMessage);
  }
};
