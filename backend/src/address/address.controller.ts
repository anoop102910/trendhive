// address.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './address.dto';
import { JwtAuthGuard } from '../guards/jwt.auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('api/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Req() req, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user.id;
    return this.addressService.create(userId, createAddressDto);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
