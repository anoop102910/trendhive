import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './client/prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { S3Module } from './client/s3/s3.module';
import { ProductModule } from './product/product.module';
import { CollectionModule } from './collection/collection.module';
import { AttributeModule } from './attribute/attribute.module';
import { UserModule } from './user/user.module';
import { CouponModule } from './coupon/coupon.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CategoryModule,
    ProductModule,
    S3Module,
    CollectionModule,
    AttributeModule,
    UserModule,
    CouponModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
