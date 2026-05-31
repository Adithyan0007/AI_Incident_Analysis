import { z } from "zod";

export const simulateScenarioSchema = {
  body: z.object({
    deployment: z.object({
      service: z.string(),
      version: z.string(),
      status: z.enum(["SUCCESS", "FAILED", "ROLLBACK"]),
      commitHash: z.string().optional(),
      deployedAt: z.iso.datetime(),
    }),

    metrics: z.array(
      z.object({
        service: z.string(),
        metricName: z.enum([
          "CPU",
          "MEMORY",
          "LATENCY",
          "ERROR_RATE",
          "THROUGHPUT",
        ]),
        value: z.number(),
        timestamp: z.iso.datetime(),
      }),
    ),

    logs: z.array(
      z.object({
        service: z.string(),
        level: z.enum(["INFO", "WARN", "ERROR", "DEBUG"]),
        message: z.string(),
        timestamp: z.iso.datetime(),
      }),
    ),

    incident: z.object({
      title: z.string().min(3),
      description: z.string().optional(),
      severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
      status: z.enum(["OPEN", "INVESTIGATING", "RESOLVED"]),
    }),
  }),
};

export type SimulateScenarioBody = z.infer<typeof simulateScenarioSchema.body>;
