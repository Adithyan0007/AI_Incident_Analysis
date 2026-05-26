import { z } from "zod";

export const metricSchema = {
  body: z.object({
    service: z.string().min(2, "Service name is required"),
    metricName: z.enum([
      "CPU",
      "MEMORY",
      "LATENCY",
      "ERROR_RATE",
      "THROUGHPUT",
    ]),
    value: z.number().nonnegative("Value must be positive"),
    timestamp: z.iso.datetime().optional(),
  }),
};

export const getMetricQuerySchema = z.object({
  service: z.string().optional(),
  metricName: z
    .enum(["CPU", "MEMORY", "LATENCY", "ERROR_RATE", "THROUGHPUT"])
    .optional(),
  limit: z.coerce.number().optional(),
});

export type MetricSchema = z.infer<typeof metricSchema.body>;
export type GetMetricQuery = z.infer<typeof getMetricQuerySchema>;
