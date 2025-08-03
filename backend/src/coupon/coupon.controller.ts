import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './coupon.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth-guard';
import { RolesGuard, UserRole } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.guard';
import { QueryParams } from 'src/utils/query-params';

@ApiTags('coupons')
@Controller('api/coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Coupon created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Coupon with this code already exists',
  })
  async create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupons retrieved successfully',
  })
  async findAll(@Query() query: QueryParams) {
    return this.couponService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Coupon not found',
  })
  async findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update coupon' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Coupon not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Delete coupon' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Coupon deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Coupon not found',
  })
  async remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
