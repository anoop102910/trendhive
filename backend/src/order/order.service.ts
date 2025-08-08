// order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './order.dto';
import { AddressService } from 'src/address/address.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly addressService: AddressService,
    private readonly cartService: CartService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { addressId, paymentMethod } = createOrderDto;

    await this.addressService.findOne(addressId);

    const { data: cart } = await this.cartService.getCart(userId);

    let grossAmount = 0;
    const orderItemsData = cart.items.map((cartItem) => {
      const itemPrice = cartItem.product.price;
      const itemTotal = itemPrice * cartItem.quantity;
      grossAmount += itemTotal;
      return {
        quantity: cartItem.quantity,
        price: itemPrice,
        productId: cartItem.productId,
      };
    });

    const shippingFee = 40;
    const taxAmount = 0.05 * grossAmount;
    const totalAmount = grossAmount + shippingFee + taxAmount;

    await this.prisma.order.create({
      data: {
        addressId,
        paymentMethod,
        userId,
        totalAmount,
        grossAmount: totalAmount,
        shippingFee: 40,
        taxAmount: 0,
        items: {
          createMany: { data: orderItemsData },
        },
      },
    });

    await this.cartService.clearCart(userId);
  }

  async findAll(userId: string) {
    return {
      data: await this.prisma.order.findMany({
        where: { userId },
      }),
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return { data: order };
  }
}
