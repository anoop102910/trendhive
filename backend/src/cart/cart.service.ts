// cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                slug: true,
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  description: true,
                  quantity: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async updateCart(userId: string, updateCartDto: UpdateCartDto) {
    const { productId, quantity } = updateCartDto;

    const cart = await this.getCart(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, quantity: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (quantity === 0) {
      if (existingItem) {
        return this.prisma.cartItem.delete({
          where: { id: existingItem.id },
        });
      }
      return null;
    }

    const finalQuantity =
      quantity > product.quantity ? product.quantity : quantity;

    if (existingItem) {
      {
        data: return this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: finalQuantity },
        });
      }
    } else {
      {
        data: return this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity: finalQuantity,
          },
        });
      }
    }
  }

  async removeItem(cartId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed successfully' };
  }
}
