import type { FastifyReply, FastifyRequest } from "fastify";
import type { InvestigateIncidentBody } from "../schemas/investigate.incident.schema.js";
import { InvestigateService } from "../services/investigate.service.js";

export const InvestigateController = async (
  req: FastifyRequest<{ Body: InvestigateIncidentBody }>,
  reply: FastifyReply,
) => {
  const loggedInUser = req.user;

  const data = await InvestigateService(
    req.body,
    req.server,
    loggedInUser.userId,
  );
  reply.send(data);
};
