import { z } from "zod";

export const deploymentSchema = {
  body: z.object({
    service: z.string().min(2, "Service name is required"),

    version: z.string().min(1, "Version is required"),

    status: z.enum(["SUCCESS", "FAILED", "ROLLBACK"]),

    commitHash: z.string().optional(),

    deployedAt: z.iso.datetime().optional(),
  }),
};

export const getDeploymentQuerySchema = z.object({
  service: z.string().optional(),

  status: z.enum(["SUCCESS", "FAILED", "ROLLBACK"]).optional(),

  limit: z.coerce.number().optional(),
});

export type DeploymentSchema = z.infer<typeof deploymentSchema.body>;

export type GetDeploymentQuery = z.infer<typeof getDeploymentQuerySchema>;
