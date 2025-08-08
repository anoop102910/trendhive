// order.dto.ts
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const OrderZodSchema = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.string().max(255),
});

export class CreateOrderDto extends createZodDto(OrderZodSchema) {}
