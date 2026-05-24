import { z } from "zod";
export const logSchema = {
  body: z.object({
    service: z.string().min(2, "Service name is required"),
    level: z.enum(["INFO", "WARN", "ERROR", "DEBUG"]),
    message: z.string().min(5, "Log message is required"),
    timestamp: z.iso.datetime().optional(),
  }),
};
export type LogSchema = z.infer<typeof logSchema.body>;
export const getLogQuerySchema = z.object({
  service: z.string().optional(),
  level: z.enum(["INFO", "WARN", "ERROR", "DEBUG"]).optional(),
  limit: z.coerce.number().optional(),
});

export type LogQuerySchema = z.infer<typeof getLogQuerySchema>;
