import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateAttributeZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Attribute name must be at least 2 characters' })
    .max(50, { message: 'Attribute name must be at most 50 characters' })
    .describe('Attribute name'),
  values: z
    .array(z.string().min(1, { message: 'Attribute value must not be empty' }))
    .min(1, { message: 'At least one attribute value is required' })
    .describe('Array of attribute values'),
});

export class CreateAttributeDto extends createZodDto(
  CreateAttributeZodSchema,
) {}

export const UpdateAttributeZodSchema = CreateAttributeZodSchema.partial();

export class UpdateAttributeDto extends createZodDto(
  UpdateAttributeZodSchema,
) {}
