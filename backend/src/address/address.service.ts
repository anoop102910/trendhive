// address.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './address.dto';
import { AddressCodeEnum } from './address.code';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return {
      data: await this.prisma.address.findMany({
        where: { userId },
      }),
    };
  }

  async findOne(id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException({
        message: 'Address not found',
        code: AddressCodeEnum.ADDRESS_NOT_FOUND,
      });
    }
    return { data: address };
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const exists = await this.prisma.address.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException({
        message: 'Address not found',
        code: AddressCodeEnum.ADDRESS_NOT_FOUND,
      });
    }
    return {
      data: await this.prisma.address.update({
        where: { id },
        data: updateAddressDto,
      }),
    };
  }

  async remove(id: string) {
    const exists = await this.prisma.address.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException({
        message: 'Address not found',
        code: AddressCodeEnum.ADDRESS_NOT_FOUND,
      });
    }
    return this.prisma.address.delete({
      where: { id },
    });
  }
}
