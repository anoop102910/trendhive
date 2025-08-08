import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  UploadImageDto,
} from './category.dto';
import { QueryParams } from 'src/utils/query-params';
import { S3Service } from 'src/client/s3/s3.service';
import { parseSorters, parseFilter, parsePagination } from 'src/utils/parsers';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new ConflictException({
        message: 'Category with this name already exists',
        code: CategoryCodeEnum.CATEGORY_NAME_ALREADY_EXISTS,
      });
    }
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });
    if (existingSlug) {
      throw new ConflictException({
        message: 'Category with this slug already exists',
        code: CategoryCodeEnum.CATEGORY_SLUG_ALREADY_EXISTS,
      });
    }
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug: createCategoryDto.slug,
      },
    });
  }

  async findAll(query: QueryParams) {
    const { filters, pagination, sorters } = query as any;
    const count = await this.prisma.category.count();
    const response = await this.prisma.category.findMany({
      where: parseFilter(filters),
      orderBy: parseSorters(sorters),
      take: pagination?.pageSize || 10,
      skip: parsePagination(pagination),
    });

    return {
      data: response,
      total: count,
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException({
        message: 'Category not found',
        code: CategoryCodeEnum.CATEGORY_NOT_FOUND,
      });
    }
    return { data: category };
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (!category) {
      throw new NotFoundException({
        message: 'Category not found',
        code: CategoryCodeEnum.CATEGORY_NOT_FOUND,
      });
    }
    return { data: category };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException({
        message: 'Category not found',
        code: CategoryCodeEnum.CATEGORY_NOT_FOUND,
      });
    }
    if (updateCategoryDto.name) {
      const existingCategory = await this.prisma.category.findFirst({
        where: { name: updateCategoryDto.name },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException({
          message: 'Category with this name already exists',
          code: CategoryCodeEnum.CATEGORY_NAME_ALREADY_EXISTS,
        });
      }
    }
    if (updateCategoryDto.slug) {
      const existingSlug = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException({
          message: 'Category with this slug already exists',
          code: CategoryCodeEnum.CATEGORY_SLUG_ALREADY_EXISTS,
        });
      }
    }
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException({
        message: 'Category not found',
        code: CategoryCodeEnum.CATEGORY_NOT_FOUND,
      });
    }
    await this.prisma.category.delete({
      where: { id },
    });
  }

  async removeMany(ids: string[]) {
    await this.prisma.category.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async uploadImage(uploadImageDto: UploadImageDto) {
    return this.s3Service.generatePresignedPutUrl(
      uploadImageDto.file.name,
      uploadImageDto.file.type,
    );
  }
}
