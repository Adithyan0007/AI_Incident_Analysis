import type { FastifyReply, FastifyRequest } from "fastify";
import type { InvestigateIncidentBody } from "../schemas/investigate.incident.schema.js";
import { InvestigateStreamService } from "../services/investigate.streamservice.js";

export const InvestigateStreamController = async (
  req: FastifyRequest<{ Body: InvestigateIncidentBody }>,
  reply: FastifyReply,
) => {
  console.log("helloooooooo");

  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendEvent = (data: unknown) => {
    reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const loggedInUser = req.user;

    await InvestigateStreamService(
      req.body,
      req.server,
      loggedInUser.userId,
      sendEvent,
    );
    console.log("habuibi");

    reply.raw.end();
  } catch (error) {
    sendEvent({
      type: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    });

    reply.raw.end();
  }
};
