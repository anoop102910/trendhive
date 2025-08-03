import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './coupon.dto';
import { QueryParams } from 'src/utils/query-params';
import { parseSorters, parseFilter, parsePagination } from 'src/utils/parsers';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { code: createCouponDto.code },
    });

    if (existingCoupon) {
      throw new ConflictException('Coupon with this code already exists');
    }

    const { productIds, userIds, ...couponData } = createCouponDto;

    return this.prisma.coupon.create({
      data: {
        ...couponData,
        startDate: new Date(couponData.startDate),
        endDate: new Date(couponData.endDate),
        ProductCoupon: productIds
          ? {
              create: productIds.map((productId) => ({
                product: {
                  connect: { id: productId },
                },
              })),
            }
          : undefined,
        assignedUsers: userIds
          ? {
              create: userIds.map((userId) => ({
                user: {
                  connect: { id: userId },
                },
              })),
            }
          : undefined,
      },
      include: {
        ProductCoupon: {
          include: {
            product: true,
          },
        },
        assignedUsers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryParams) {
    const { filters, pagination, sorters } = query as any;
    const count = await this.prisma.coupon.count({
      where: parseFilter(filters),
    });

    const coupons = await this.prisma.coupon.findMany({
      where: parseFilter(filters),
      orderBy: parseSorters(sorters),
      take: pagination?.pageSize || 10,
      skip: parsePagination(pagination),
      include: {
        _count: {
          select: {
            assignedUsers: true,
            ProductCoupon: true,
          },
        },
      },
    });

    return {
      data: coupons,
      total: count,
    };
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        assignedUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        ProductCoupon: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return { data: coupon };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const exists = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Coupon not found');
    }

    if (updateCouponDto.code) {
      const existingCoupon = await this.prisma.coupon.findUnique({
        where: { code: updateCouponDto.code },
      });

      if (existingCoupon && existingCoupon.id !== id) {
        throw new ConflictException('Coupon with this code already exists');
      }
    }

    if (updateCouponDto.startDate && updateCouponDto.endDate) {
      if (
        new Date(updateCouponDto.startDate) > new Date(updateCouponDto.endDate)
      ) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    const { productIds, userIds, ...couponData } = updateCouponDto;

    // First, handle the coupon data update
    const updatedCoupon = await this.prisma.coupon.update({
      where: { id },
      data: {
        ...couponData,
        startDate: couponData.startDate
          ? new Date(couponData.startDate)
          : undefined,
        endDate: couponData.endDate ? new Date(couponData.endDate) : undefined,
      },
    });

    // If productIds are provided, update product associations
    if (productIds) {
      // Delete existing product associations
      await this.prisma.productCoupon.deleteMany({
        where: { couponId: id },
      });

      // Create new product associations
      if (productIds.length > 0) {
        await this.prisma.productCoupon.createMany({
          data: productIds.map((productId) => ({
            couponId: id,
            productId,
          })),
        });
      }
    }

    // If userIds are provided, update user associations
    if (userIds) {
      // Delete existing user associations
      await this.prisma.userCoupon.deleteMany({
        where: { couponId: id },
      });

      // Create new user associations
      if (userIds.length > 0) {
        await this.prisma.userCoupon.createMany({
          data: userIds.map((userId) => ({
            couponId: id,
            userId,
            assignedAt: new Date(),
          })),
        });
      }
    }

    // Return the updated coupon with its associations
    return this.prisma.coupon.findUnique({
      where: { id },
      include: {
        ProductCoupon: {
          include: {
            product: true,
          },
        },
        assignedUsers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Coupon not found');
    }

    await this.prisma.coupon.delete({
      where: { id },
    });

    return { message: 'Coupon deleted successfully' };
  }
}
