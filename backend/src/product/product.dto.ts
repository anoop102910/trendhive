import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateProductZodSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Product name must be at least 3 characters' })
    .max(255, { message: 'Product name must be at most 255 characters' })
    .describe('Product name'),
  slug: z
    .string()
    .min(3, { message: 'Product slug must be at least 3 characters' })
    .max(255, { message: 'Product slug must be at most 255 characters' })
    .describe('Product slug'),
  description: z.string().optional().describe('Product description as string'),
  price: z
    .number()
    .positive({ message: 'Price must be a positive number' })
    .describe('Product price'),
  currency: z.string().default('IND').describe('Product currency'),
  quantity: z
    .number()
    .int()
    .nonnegative({ message: 'Quantity must be zero or positive' })
    .describe('Product quantity'),
  sku: z.string().optional().describe('Product SKU'),
  isPublished: z
    .boolean()
    .default(false)
    .describe('Whether the product is published'),
  isFeatured: z
    .boolean()
    .default(false)
    .describe('Whether the product is featured'),
  metadata: z.record(z.any()).optional().describe('Product metadata'),
  private_metadata: z
    .record(z.any())
    .optional()
    .describe('Private product metadata'),
  seoTitle: z
    .string()
    .min(3, { message: 'SEO title must be at least 3 characters' })
    .max(60, { message: 'SEO title must be at most 60 characters' })
    .optional()
    .describe('SEO title'),
  seoDescription: z
    .string()
    .min(10, { message: 'SEO description must be at least 10 characters' })
    .max(160, { message: 'SEO description must be at most 160 characters' })
    .optional()
    .describe('SEO description'),
  categoryId: z
    .string()
    .uuid({ message: 'Category ID must be a valid UUID' })
    .optional()
    .describe('Category ID'),
});

export const UpdateProductZodSchema = CreateProductZodSchema.partial().extend({
  updatedBy: z.string().uuid().optional(),
});

export const CreateProductBatchZodSchema = z.object({
  products: z.array(CreateProductZodSchema),
});

export class CreateProductDto extends createZodDto(CreateProductZodSchema) {}
export class UpdateProductDto extends createZodDto(UpdateProductZodSchema) {}
export class CreateProductBatchDto extends createZodDto(
  CreateProductBatchZodSchema,
) {}
