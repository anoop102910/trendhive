import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateCartZodSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1, { message: 'Quantity must be at least 1' }),
});

export class UpdateCartDto extends createZodDto(UpdateCartZodSchema) {}
