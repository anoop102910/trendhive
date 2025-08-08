import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductCodeEnum } from './product.code';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductBatchDto,
} from './product.dto';
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
      throw new ConflictException({
        message: 'Product with this name already exists',
        code: ProductCodeEnum.PRODUCT_NAME_ALREADY_EXISTS,
      });
    }
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });
    if (existingSlug) {
      throw new ConflictException({
        message: 'Product with this slug already exists',
        code: ProductCodeEnum.PRODUCT_SLUG_ALREADY_EXISTS,
      });
    }

    if (createProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException({
          message: 'Category not found',
          code: ProductCodeEnum.CATEGORY_NOT_FOUND,
        });
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
      throw new NotFoundException({
        message: 'Product not found',
        code: ProductCodeEnum.PRODUCT_NOT_FOUND,
      });
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
      throw new NotFoundException({
        message: 'Product not found',
        code: ProductCodeEnum.PRODUCT_NOT_FOUND,
      });
    }
    return { data: product };
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException({
        message: 'Product not found',
        code: ProductCodeEnum.PRODUCT_NOT_FOUND,
      });
    }

    if (updateProductDto.name) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { name: updateProductDto.name },
      });
      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException({
          message: 'Product with this name already exists',
          code: ProductCodeEnum.PRODUCT_NAME_ALREADY_EXISTS,
        });
      }
    }

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException({
          message: 'Category not found',
          code: ProductCodeEnum.CATEGORY_NOT_FOUND,
        });
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
      throw new NotFoundException({
        message: 'Product not found',
        code: ProductCodeEnum.PRODUCT_NOT_FOUND,
      });
    }
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }

  // async createBatch(
  //   createProductBatchDto: CreateProductBatchDto,
  //   userId: string,
  // ) {
  //   const { products } = createProductBatchDto;
  //   const errors = [];
  //   const createdProducts = [];

  //   // Check for duplicates within the payload first
  //   const seenNames = new Set();
  //   const seenSlugs = new Set();
  //   for (let i = 0; i < products.length; i++) {
  //     const product = products[i];
  //     if (seenNames.has(product.name)) {
  //       errors.push({
  //         row: i + 2,
  //         name: product.name,
  //         error: 'Duplicate name in file.',
  //       });
  //     }
  //     if (seenSlugs.has(product.slug)) {
  //       errors.push({
  //         row: i + 2,
  //         name: product.name,
  //         error: 'Duplicate slug in file.',
  //       });
  //     }
  //     seenNames.add(product.name);
  //     seenSlugs.add(product.slug);
  //   }

  //   if (errors.length > 0) {
  //     return { createdCount: 0, errors, createdProducts: [] };
  //   }

  //   // Now, process creation
  //   for (let i = 0; i < products.length; i++) {
  //     const productDto = products[i];
  //     try {
  //       const product = await this.create(productDto, userId);
  //       createdProducts.push(product);
  //     } catch (error) {
  //       errors.push({
  //         row: i + 2, // Assuming CSV has a header row
  //         name: productDto.name,
  //         error: error.message,
  //       });
  //     }
  //   }

  //   return {
  //     createdCount: createdProducts.length,
  //     errors,
  //     createdProducts,
  //   };
  // }
}
