// address.dto.ts
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AddressZodSchema = z.object({
  addressLine1: z.string().min(1).max(1024),
  addressLine2: z.string().min(1).max(1024),
  city: z.string().min(1).max(255),
  state: z.string().min(1).max(255),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(255),
});

export class CreateAddressDto extends createZodDto(AddressZodSchema) {}

export const UpdateAddressZodSchema = AddressZodSchema.partial();

export class UpdateAddressDto extends createZodDto(UpdateAddressZodSchema) {}
