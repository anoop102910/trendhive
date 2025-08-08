import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaCodeEnum } from './media.code';
import { Media, Prisma } from '@prisma/client';
import { CrudFilter, CrudSort, Pagination } from 'src/utils/query-params';
import { parseSorters, parseFilter, parsePagination } from 'src/utils/parsers';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MediaCreateInput): Promise<Media> {
    return this.prisma.media.create({
      data,
    });
  }

  async findAll({
    userId,
    filters,
    sorters,
    pagination = { current: 1, pageSize: 20 },
  }: {
    userId: string;
    filters?: CrudFilter[];
    sorters?: CrudSort[];
    pagination?: Pagination;
  }): Promise<Media[]> {
    return this.prisma.media.findMany({
      where: { createdBy: userId, ...parseFilter(filters) },
      orderBy: parseSorters(sorters),
      take: pagination?.pageSize,
      skip: parsePagination(pagination),
    });
  }

  async remove(where: Prisma.MediaWhereUniqueInput): Promise<Media> {
    const media = await this.prisma.media.findUnique({ where });
    if (!media) {
      throw new NotFoundException({
        message: `Media with ID ${where.id} not found`,
        code: MediaCodeEnum.MEDIA_NOT_FOUND,
      });
    }
    return this.prisma.media.delete({
      where,
    });
    return media;
  }
}
