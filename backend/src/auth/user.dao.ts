import { Injectable } from '@nestjs/common';
import { PrismaService } from '../client/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

interface IUser {
  email: string;
  password?: string;
  name?: string;
  profilePicture?: string;
}

interface GetUserQuery {
  limit?: number;
  cursor?: number;
}

@Injectable()
export class UserDao {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createUser(userInput: Prisma.UserCreateInput): Promise<any> {
    return this.prisma.user.create({
      data: userInput,
    });
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByIdWithoutPassword(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAllUsers(query: GetUserQuery): Promise<any[]> {
    return this.prisma.user.findMany({
      take: query.limit ?? 10,
      skip: query.cursor ?? 0,
    });
  }

  async updateVerificationToken(userId: string, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: new Date(
          Date.now() +
            this.configService.get<number>('VERIFICATION_EXPIRATION_TIME')!,
        ),
      },
    });
  }

  async getUserByVerificationToken(token: string): Promise<any | null> {
    return this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });
  }
}
