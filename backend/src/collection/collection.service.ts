import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CollectionCodeEnum } from './collection.code';
import { CreateCollectionDto, UpdateCollectionDto } from './collection.dto';
import { QueryParams } from 'src/utils/query-params';
import { parseSorters, parseFilter, parsePagination } from 'src/utils/parsers';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const { productIds, ...collectionData } = createCollectionDto;

    const existingCollection = await this.prisma.collection.findFirst({
      where: { name: collectionData.name },
    });
    if (existingCollection) {
      throw new ConflictException({
        message: 'Collection with this name already exists',
        code: CollectionCodeEnum.COLLECTION_NAME_ALREADY_EXISTS,
      });
    }

    const existingSlug = await this.prisma.collection.findFirst({
      where: { slug: collectionData.slug },
    });
    if (existingSlug) {
      throw new ConflictException({
        message: 'Collection with this slug already exists',
        code: CollectionCodeEnum.COLLECTION_SLUG_ALREADY_EXISTS,
      });
    }

    return this.prisma.collection.create({
      data: {
        ...collectionData,

        collectionProduct: productIds
          ? {
              create: productIds.map((productId) => ({
                product: {
                  connect: { id: productId },
                },
              })),
            }
          : undefined,
      },
    });
  }

  async findAll(query: QueryParams) {
    const { filters, pagination, sorters } = query as any;
    const count = await this.prisma.collection.count();
    const response = await this.prisma.collection.findMany({
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
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        collectionProduct: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!collection) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: CollectionCodeEnum.COLLECTION_NOT_FOUND,
      });
    }

    return { data: collection };
  }

  async findBySlug(slug: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { slug },
      include: {
        collectionProduct: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!collection) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: CollectionCodeEnum.COLLECTION_NOT_FOUND,
      });
    }

    return { data: collection };
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    const { productIds, ...collectionData } = updateCollectionDto;

    const exists = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!exists) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: CollectionCodeEnum.COLLECTION_NOT_FOUND,
      });
    }

    if (collectionData.name) {
      const existingCollection = await this.prisma.collection.findFirst({
        where: { name: collectionData.name },
      });
      if (existingCollection && existingCollection.id !== id) {
        throw new ConflictException({
          message: 'Collection with this name already exists',
          code: CollectionCodeEnum.COLLECTION_NAME_ALREADY_EXISTS,
        });
      }
    }

    return this.prisma.collection.update({
      where: { id },
      data: {
        ...collectionData,
        collectionProduct: productIds
          ? {
              deleteMany: {},
              create: productIds.map((productId) => ({
                product: {
                  connect: { id: productId },
                },
              })),
            }
          : undefined,
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.collection.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: CollectionCodeEnum.COLLECTION_NOT_FOUND,
      });
    }

    await this.prisma.collection.delete({ where: { id } });
    return { success: true };
  }
}
