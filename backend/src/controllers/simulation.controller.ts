import type { FastifyReply, FastifyRequest } from "fastify";
import type { SimulateScenarioBody } from "../schemas/simulation.schema.js";
import { SimulationService } from "../services/simulation.service.js";
export const SimulationController = async (
  req: FastifyRequest<{ Body: SimulateScenarioBody }>,
  reply: FastifyReply,
) => {
  try {
    const loggedInUser = req.user;
    const data = await SimulationService(
      req.body,
      req.server,
      loggedInUser?.userId,
    );
    reply.send(data);
  } catch (error) {
    reply.send(error);
  }
};
