import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateCategoryZodSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Category name must be at least 3 characters' })
    .max(50, { message: 'Category name must be at most 50 characters' })
    .describe('Category name'),
  slug: z
    .string()
    .min(3, { message: 'Category slug must be at least 3 characters' })
    .max(50, { message: 'Category slug must be at most 50 characters' })
    .describe('Category slug'),
  description: z.string().optional().describe('Category description as string'),
  metadata: z
    .record(z.string().min(1).max(255))
    .optional()
    .describe('Category metadata as a record of strings'),
  seoSlug: z
    .string()
    .min(3, { message: 'SEO slug must be at least 3 characters' })
    .max(60, { message: 'SEO slug must be at most 60 characters' })
    .optional()
    .describe('SEO slug'),
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
});

export const UploadImageZodSchema = z.object({
  file: z.any(),
});

export class CreateCategoryDto extends createZodDto(CreateCategoryZodSchema) {}

export const UpdateCategoryZodSchema = CreateCategoryZodSchema.partial();

export class UpdateCategoryDto extends createZodDto(UpdateCategoryZodSchema) {}

export class UploadImageDto extends createZodDto(UploadImageZodSchema) {}
