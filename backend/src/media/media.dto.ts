import { z } from 'zod';

export const mediaCreateSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  fileName: z.string().optional(),
  size: z.number().int().optional(),
  mimeType: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});

export type MediaCreateDto = z.infer<typeof mediaCreateSchema>;