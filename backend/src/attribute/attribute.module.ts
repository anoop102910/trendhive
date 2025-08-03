import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AttributeController],
  providers: [AttributeService, PrismaService],
  exports: [AttributeService],
})
export class AttributeModule {}
