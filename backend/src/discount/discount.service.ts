// src/discounts/discount.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto, UpdateDiscountDto } from './discount.dto';
import { Prisma } from '@prisma/client';
import { QueryParams } from 'src/utils/query-params';
import { parseFilter, parseSorters, parsePagination } from 'src/utils/parsers';
import { CodeEnum } from './discount.code';

@Injectable()
export class DiscountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDiscountDto: CreateDiscountDto) {
    if (createDiscountDto.code) {
      const existingDiscount = await this.prisma.discount.findUnique({
        where: { code: createDiscountDto.code },
      });
      if (existingDiscount) {
        throw new ConflictException(CodeEnum.DISCOUNT_ALREADY_EXISTS);
      }
    }
    const { productIds, ...discountData } = createDiscountDto;

    return this.prisma.discount.create({
      data: {
        ...discountData,
        products: {
          connect: productIds?.map((id) => ({ id })) || [],
        },
      },
    });
  }

  async findAll(query: QueryParams) {
    const { filters, pagination, sorters } = query as any;
    const count = await this.prisma.discount.count();
    const response = await this.prisma.discount.findMany({
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
    const discount = await this.prisma.discount.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    if (!discount) {
      throw new NotFoundException(CodeEnum.DISCOUNT_NOT_FOUND);
    }
    return { data: discount };
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    const existingDiscount = await this.prisma.discount.findUnique({
      where: { id },
    });
    if (!existingDiscount) {
      throw new NotFoundException(CodeEnum.DISCOUNT_NOT_FOUND);
    }

    const { productIds, ...discountData } = updateDiscountDto;

    return this.prisma.discount.update({
      where: { id },
      data: {
        ...discountData,
        products: {
          set: productIds?.map((id) => ({ id })),
        },
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.discount.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(CodeEnum.DISCOUNT_NOT_FOUND);
    }
    return this.prisma.discount.delete({ where: { id } });
  }

  async removeMany(ids: string[]) {
    await this.prisma.discount.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
