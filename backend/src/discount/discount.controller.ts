// src/discounts/discount.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto, UpdateDiscountDto } from './discount.dto';
import { JwtAuthGuard } from '../guards/jwt.auth-guard';
import { QueryParams } from 'src/utils/query-params';

@UseGuards(JwtAuthGuard)
@Controller('api/discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.discountService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.discountService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
