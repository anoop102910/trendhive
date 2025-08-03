import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttributeDto, UpdateAttributeDto } from './attribute.dto';
import { QueryParams } from 'src/utils/query-params';
import { parseSorters, parseFilter, parsePagination } from 'src/utils/parsers';

@Injectable()
export class AttributeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAttributeDto: CreateAttributeDto) {
    const existingAttribute = await this.prisma.attribute.findFirst({
      where: { name: createAttributeDto.name },
    });

    if (existingAttribute) {
      throw new ConflictException('Attribute with this name already exists');
    }

    return this.prisma.attribute.create({
      data: {
        name: createAttributeDto.name,
        values: {
          create: createAttributeDto.values.map((value) => ({
            value,
          })),
        },
      },
      include: {
        values: true,
      },
    });
  }

  async findAll(query: QueryParams) {
    const { filters, pagination, sorters } = query as any;
    const count = await this.prisma.attribute.count();
    const response = await this.prisma.attribute.findMany({
      where: parseFilter(filters),
      orderBy: parseSorters(sorters),
      take: pagination?.pageSize || 10,
      skip: parsePagination(pagination),
      include: {
        values: true,
      },
    });

    return {
      data: response,
      total: count,
    };
  }

  async findOne(id: string) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id },
      include: {
        values: true,
      },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    return { data: attribute };
  }

  async update(id: string, updateAttributeDto: UpdateAttributeDto) {
    const exists = await this.prisma.attribute.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Attribute not found');
    }

    if (updateAttributeDto.name) {
      const existingAttribute = await this.prisma.attribute.findFirst({
        where: { name: updateAttributeDto.name },
      });
      if (existingAttribute && existingAttribute.id !== id) {
        throw new ConflictException('Attribute with this name already exists');
      }
    }

    // Update attribute
    const updateData: any = { name: updateAttributeDto.name };

    // If values are provided, update them
    if (updateAttributeDto.values) {
      // Delete existing values
      await this.prisma.attributeValue.deleteMany({
        where: { attributeId: id },
      });

      // Create new values
      updateData.values = {
        create: updateAttributeDto.values.map((value) => ({
          value,
        })),
      };
    }

    return this.prisma.attribute.update({
      where: { id },
      data: updateData,
      include: {
        values: true,
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.attribute.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Attribute not found');
    }

    await this.prisma.attribute.delete({
      where: { id },
    });

    return { message: 'Attribute deleted successfully' };
  }
}
