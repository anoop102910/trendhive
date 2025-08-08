import { z } from 'zod';

export const CreateProductZodSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Product name must be at least 3 characters' })
    .max(255, { message: 'Product name must be at most 255 characters' }),
  slug: z
    .string()
    .min(3, { message: 'Product slug must be at least 3 characters' })
    .max(255, { message: 'Product slug must be at most 255 characters' }),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().positive({ message: 'Price must be a positive number' })),
  currency: z.string().default('IND'),
  quantity: z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: 'Quantity must be zero or positive' })),
  sku: z.string().optional(),
  isPublished: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(false)),
  isFeatured: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(false)),
  categoryId: z.string().uuid({ message: 'Category ID must be a valid UUID' }).optional().or(z.literal('')),
});
