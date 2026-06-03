import { z } from "zod";

export const investigateIncidentSchema = {
  body: z.object({
    incidentId: z.string().min(1),
  }),
};

export type InvestigateIncidentBody = z.infer<
  typeof investigateIncidentSchema.body
>;