import type { FastifyInstance } from "fastify";
import type { InvestigateIncidentBody } from "../schemas/investigate.incident.schema.js";
import { log } from "node:console";
import { GetGeminiRcaReport } from "./ai.service.js";
export const InvestigateService = async (
  input: InvestigateIncidentBody,
  app: FastifyInstance,
  loggedInUser: string,
) => {
  const incident = await app.prisma.incident.findUnique({
    where: {
      id: input.incidentId,
    },
  });
  if (!incident) {
    throw new Error("Incident not found");
  }

  const deployment = await app.prisma.deployment.findFirst({
    where: {
      deployedAt: {
        lte: incident.createdAt,
      },
    },
    orderBy: {
      deployedAt: "desc",
    },
  });
  if (!deployment) {
    throw new Error("No deployment found before this incident");
  }

  const metrics = await app.prisma.metric.findMany({
    where: {
      timestamp: {
        gte: deployment.deployedAt,
      },
      service: deployment.service,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  const logs = await app.prisma.log.findMany({
    where: {
      timestamp: {
        gte: deployment.deployedAt,
      },
      service: deployment.service,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  const dividedLogs: Record<string, typeof logs> = {};
  const dividedMetrics: Record<string, typeof metrics> = {};
  logs.forEach((val) => {
    const currentGroup = dividedLogs[val.level];

    if (currentGroup) {
      currentGroup.push(val);
    } else {
      dividedLogs[val.level] = [val];
    }
  });
  metrics.forEach((val) => {
    const currentGroup = dividedMetrics[val.metricName];

    if (currentGroup) {
      currentGroup.push(val);
    } else {
      dividedMetrics[val.metricName] = [val];
    }
  });
  const findings: string[] = [];

  const errorLogs = dividedLogs.ERROR ?? [];
  const warnLogs = dividedLogs.WARN ?? [];

  const latencyMetrics = dividedMetrics.LATENCY ?? [];
  const errorRateMetrics = dividedMetrics.ERROR_RATE ?? [];
  const cpuMetrics = dividedMetrics.CPU ?? [];

  const maxLatency = Math.max(
    ...latencyMetrics.map((metric) => metric.value),
    0,
  );

  const maxErrorRate = Math.max(
    ...errorRateMetrics.map((metric) => metric.value),
    0,
  );

  const maxCpu = Math.max(...cpuMetrics.map((metric) => metric.value), 0);

  if (errorLogs.length > 0) {
    findings.push(`${errorLogs.length} ERROR logs found after deployment`);
  }

  if (warnLogs.length > 0) {
    findings.push(`${warnLogs.length} WARN logs found after deployment`);
  }

  if (maxLatency > 500) {
    findings.push(`Latency spiked to ${maxLatency}ms`);
  }

  if (maxErrorRate > 5) {
    findings.push(`Error rate increased to ${maxErrorRate}%`);
  }

  if (maxCpu > 80) {
    findings.push(`CPU usage reached ${maxCpu}%`);
  }

  const structuredInvestigation = {
    incident,
    deployment,
    findings,
    evidence: {
      errorLogs,
      warnLogs,
      latencyMetrics,
      errorRateMetrics,
      cpuMetrics,
    },
  };

  const prompt = `
You are an AI DevOps Incident Investigator.

Analyze the following incident data and generate a professional Root Cause Analysis report.

Rules:
- Use only the provided data.
- Do not invent facts.
- If evidence is insufficient, say so.
- Be concise but specific.

Return the report in this structure:
1. Incident Summary
2. Likely Root Cause
3. Evidence
4. Impact
5. Recommended Actions
6. Confidence Level

Incident Data:
${JSON.stringify(structuredInvestigation, null, 2)}
`;

  const geminiReport = await GetGeminiRcaReport(prompt);
  const agentRunResult = await app.prisma.agentRun.create({
    data: {
      query: "Why did this incident occur?",
      intent: "incident_investigation",
      status: "completed",

      plan: [
        "Fetch incident",
        "Find latest deployment before incident",
        "Fetch metrics after deployment",
        "Fetch logs after deployment",
        "Analyze findings",
        "Generate RCA with Gemini",
      ],

      result: {
        structuredInvestigation,
        aiReport: geminiReport,
      },

      userId: loggedInUser,
      incidentId: incident.id,
    },
  });
  return {
    agentRunId: agentRunResult.id,
    structuredInvestigation,
    aiReport: geminiReport,
  };
};
