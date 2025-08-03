import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParams } from 'src/utils/query-params';
import { parseSorters, parseFilter, parsePagination } from 'src/utils/parsers';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryParams) {
    const { filters, pagination, sorters } = query as any;

    const count = await this.prisma.user.count({
      where: parseFilter(filters),
    });

    const users = await this.prisma.user.findMany({
      where: parseFilter(filters),
      orderBy: parseSorters(sorters),
      take: pagination?.pageSize || 10,
      skip: parsePagination(pagination),
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    const sanitizedUsers = users.map((user) => {
      const { password, emailVerificationToken, ...rest } = user;
      return rest;
    });

    return {
      data: sanitizedUsers,
      total: count,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { password, emailVerificationToken, ...sanitizedUser } = user;

    return {
      data: sanitizedUser,
    };
  }
}
