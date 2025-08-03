import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { QueryParams } from 'src/utils/query-params';
import { parseFilter, parsePagination, parseSorters } from 'src/utils/parsers';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const existingProduct = await this.prisma.product.findFirst({
      where: { name: createProductDto.name },
    });
    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });
    if (existingSlug) {
      throw new ConflictException('Product with this slug already exists');
    }

    if (createProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        createdBy: userId,
      },
    });
  }

  async findAll(query: QueryParams) {
    const { filters, pagination, sorters } = query as any;
    const count = await this.prisma.product.count();
    const response = await this.prisma.product.findMany({
      where: parseFilter(filters),
      orderBy: parseSorters(sorters),
      take: pagination?.pageSize || 10,
      skip: parsePagination(pagination),

      include: {
        category: true,
      },
    });

    return {
      data: response,
      total: count,
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { data: product };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { data: product };
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.name) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { name: updateProductDto.name },
      });
      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this name already exists');
      }
    }

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        updatedBy: userId,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('Product not found');
    }
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }
}
