import type { FastifyInstance } from "fastify";
import type { InvestigateIncidentBody } from "../schemas/investigate.incident.schema.js";
import { GetGeminiRcaReport } from "./ai.service.js";
import { getIncidentTool } from "./tools/incident.tool.js";
import { getDeploymentTool } from "./tools/deployment.tool.js";
import { getMetricTool } from "./tools/metric.tool.js";
import { getLogsTool } from "./tools/logs.tool.js";
import { toolRunner } from "./tools/toolRunner.js";
export const InvestigateService = async (
  input: InvestigateIncidentBody,
  app: FastifyInstance,
  loggedInUser: string,
) => {
  const agentRunArray: any[] = [];
  const incident = await toolRunner(agentRunArray, "getIncidentTool", () =>
    getIncidentTool(input.incidentId, app),
  );
  if (!incident) {
    throw new Error("Incident not found");
  }
  const deployment = await toolRunner(agentRunArray, "getDeploymentTool", () =>
    getDeploymentTool(incident.createdAt, app),
  );

  if (!deployment) {
    throw new Error("No deployment found before this incident");
  }
  const metrics = await toolRunner(agentRunArray, "getMetricTool", () =>
    getMetricTool(deployment.service, deployment.deployedAt, app),
  );
  console.log(metrics);

  const logs = await toolRunner(agentRunArray, "getLogTool", () =>
    getLogsTool(deployment.service, deployment.deployedAt, app),
  );
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
  console.log(findings);

  const structuredInvestigation = {
    incident,
    deployment,
    agentSteps: agentRunArray,
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

      plan: agentRunArray,

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
