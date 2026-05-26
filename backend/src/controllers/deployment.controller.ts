import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  DeploymentSchema,
  GetDeploymentQuery,
} from "../schemas/deployment.schema.js";
import {
  GetDeploymentService,
  PostDeploymentService,
} from "../services/deployment.service.js";

export const PostDeploymentController = async (
  req: FastifyRequest<{ Body: DeploymentSchema }>,
  reply: FastifyReply,
) => {
  try {
    await PostDeploymentService(req.body, req.server);

    return reply.status(201).send({
      message: "Deployment added successfully",
    });
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }
  }
};
export const GetDeploymentController = async (
  req: FastifyRequest<{ Querystring: GetDeploymentQuery }>,
  reply: FastifyReply,
) => {
  try {
    const data = await GetDeploymentService(req.server, req.query);
    return reply.send(data);
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }
  }
};
