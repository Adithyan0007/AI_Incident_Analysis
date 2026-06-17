import type { FastifyReply, FastifyRequest } from "fastify";
import type { InvestigateIncidentBody } from "../schemas/investigate.incident.schema.js";
import { InvestigateStreamService } from "../services/investigate.streamservice.js";

export const InvestigateStreamController = async (
  req: FastifyRequest<{ Body: InvestigateIncidentBody }>,
  reply: FastifyReply,
) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://incidentanalysis0.netlify.app", // Your additional origin
  ];

  // 2. Get the origin from the incoming request
  const requestOrigin: any = req.headers.origin;

  // 3. Check if the request origin is in your allowed list
  const currentOrigin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0]; // Fallback to your default
  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    // ⬇️ ADD THESE MANUALLY HERE AS WELL ⬇️
    "Access-Control-Allow-Origin": currentOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
