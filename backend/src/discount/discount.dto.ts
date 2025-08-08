import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateDiscountZodSchema = z.object({
  name: z.string().min(3).max(255),
  code: z.string().optional().nullable().default(null),
  description: z.string().optional().nullable().default(null),
  type: z
    .enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'])
    .default('PERCENTAGE'),
  value: z.number().min(0),
  startDate: z.string().pipe(z.coerce.date()),
  endDate: z
    .string()
    .optional()
    .nullable()
    .default(null)
    .pipe(z.coerce.date().optional().nullable()),
  isActive: z.boolean().default(true),
  productIds: z.array(z.string().uuid()).optional(),
});

export class CreateDiscountDto extends createZodDto(CreateDiscountZodSchema) {}

export const UpdateDiscountZodSchema = CreateDiscountZodSchema.partial();

export class UpdateDiscountDto extends createZodDto(UpdateDiscountZodSchema) {}
