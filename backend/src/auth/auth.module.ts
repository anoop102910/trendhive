import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDao } from './user.dao';
import { PrismaModule } from '../client/prisma/prisma.module';
import { EmailModule } from '../client/email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, UserDao],
})
export class AuthModule {}
