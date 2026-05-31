import type { FastifyReply, FastifyRequest } from "fastify";
import {
  addIncidentService,
  getIncidentService,
  getIncidentByIdService,
} from "../services/incident.service.js";
import type { IncidentBody } from "../schemas/incident.schema.js"; // Import Zod inferred type

export const addIncident = async (
  req: FastifyRequest<{ Body: IncidentBody }>,
  reply: FastifyReply,
) => {
  try {
    const loggedInUser = req.user;
    const result = await addIncidentService(
      req.body,
      req.server,
      loggedInUser?.userId,
    );
    reply.send(result);
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({
        message: error.message,
      });
    }
  }
};

export const getIncident = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = await getIncidentService(req.server);
    reply.send(data);
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(401).send({
        message: error.message,
      });
    }
  }
};
export const getIncidentById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params;
    const data = await getIncidentByIdService(id, req.server);
    if (!data) {
      return reply.status(404).send({ message: "Incident not found" });
    }
    return reply.status(200).send(data);
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(401).send({
        message: error.message,
      });
    }
  }
};
