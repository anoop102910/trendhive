import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { UpdateCartDto } from './cart.dto';
import { JwtAuthGuard } from '../guards/jwt.auth-guard';

@ApiTags('cart')
@Controller('api/cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cart retrieved successfully',
  })
  getCart(@Req() req) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add or update item in cart' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cart item added or updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  updateCart(@Req() req, @Body() updateCartDto: UpdateCartDto) {
    const userId = req.user.id;
    return this.cartService.updateCart(userId, updateCartDto);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Item removed successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cart or cart item not found',
  })
  removeItem(@Req() req, @Param('itemId') itemId: string) {
    const userId = req.user.id;
    return this.cartService.removeItem(userId, itemId);
  }
}
