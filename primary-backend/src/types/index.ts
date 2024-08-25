import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const ZapCreateSchema = z.object({
  availableTriggerId: z.string(),
  triggerMetadata: z.any().optional(),
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      actionMetadata: z.any().optional(),
    })
  ),
});

export type SignupSchema = z.infer<typeof SignupSchema>;
