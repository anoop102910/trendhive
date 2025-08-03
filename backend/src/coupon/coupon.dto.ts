import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CouponType } from '@prisma/client';

const baseCouponSchema = z.object({
  code: z
    .string()
    .min(3, { message: 'Coupon code must be at least 3 characters' })
    .max(50, { message: 'Coupon code must be at most 50 characters' }),
  description: z.string().optional(),
  discountType: z.nativeEnum(CouponType),
  discountValue: z.number().positive(),
  usageLimit: z.number().int().positive().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isActive: z.boolean().default(true),
  productIds: z.array(z.string()).optional(),
  userIds: z.array(z.string()).optional(),
});

export const CreateCouponZodSchema = baseCouponSchema.refine(
  (data) =>
    new Date(data.endDate).getTime() > new Date(data.startDate).getTime(),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  },
);

export class CreateCouponDto extends createZodDto(CreateCouponZodSchema) {}

export const UpdateCouponZodSchema = baseCouponSchema.partial();

export class UpdateCouponDto extends createZodDto(UpdateCouponZodSchema) {}
