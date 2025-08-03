import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CodeEnum } from '../auth/auth.code';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        message: 'No token provided',
        code: CodeEnum.INVALID_TOKEN,
      });
    }

    try {
      const payload = jwt.verify(
        token,
        this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      ) as { userId: string };

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        console.log('User not found');
        throw new UnauthorizedException({
          message: 'User not found',
          code: CodeEnum.INVALID_TOKEN,
        });
      }

      request.user = user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException({
        message: 'Invalid token',
        code: CodeEnum.INVALID_TOKEN,
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
