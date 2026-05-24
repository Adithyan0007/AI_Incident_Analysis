import { z } from "zod";

export const addIncidentSchema = {
  body: z.object({
    title: z.string().min(3, { error: "Title must be at least 3 characters" }),
    description: z.string().min(10, { error: "Description must be detailed" }),
    severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    status: z.enum(["OPEN", "INVESTIGATING", "RESOLVED"]),
  }),
};

export type IncidentBody = z.infer<typeof addIncidentSchema.body>;
