import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateCollectionZodSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Collection name must be at least 3 characters' })
    .max(250, { message: 'Collection name must be at most 250 characters' })
    .describe('Collection name'),
  slug: z
    .string()
    .min(3, { message: 'Collection slug must be at least 3 characters' })
    .max(255, { message: 'Collection slug must be at most 255 characters' })
    .describe('Collection slug'),
  description: z.string().optional().describe('Collection description as JSON'),
  backgroundImage: z
    .string()
    .max(100, {
      message: 'Background image URL must be at most 100 characters',
    })
    .optional()
    .describe('Collection background image URL'),
  backgroundImageAlt: z
    .string()
    .max(128, {
      message: 'Background image alt text must be at most 128 characters',
    })
    .optional()
    .describe('Collection background image alt text'),
  metadata: z
    .array(
      z.object({
        key: z.string().min(1).max(255),
        value: z.string().min(1).max(255),
      }),
    )
    .optional()
    .describe('Collection metadata'),
  privateMetadata: z
    .array(
      z.object({
        key: z.string().min(1).max(255),
        value: z.string().min(1).max(255),
      }),
    )
    .optional()
    .describe('Collection private metadata'),
  productIds: z
    .array(z.string().uuid())
    .optional()
    .describe('Array of product IDs to associate with the collection'),
});

export const UpdateCollectionZodSchema = CreateCollectionZodSchema.partial();

export class CreateCollectionDto extends createZodDto(
  CreateCollectionZodSchema,
) {}
export class UpdateCollectionDto extends createZodDto(
  UpdateCollectionZodSchema,
) {}
