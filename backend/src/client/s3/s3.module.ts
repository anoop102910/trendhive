import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { S3Service } from './s3.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get<string>('AWS_S3_REGION')!,
          credentials: {
            accessKeyId: configService.get<string>('MINIO_ACCESS_KEY')!,
            secretAccessKey: configService.get<string>('MINIO_SECRET_KEY')!,
          },
          endpoint: `http://${configService.get<string>('MINIO_ENDPOINT')}:${configService.get<string>('MINIO_PORT')!}`,
          forcePathStyle: true,
        });
      },
      inject: [ConfigService],
    },
    S3Service,
  ],
  exports: [S3Service],
})
export class S3Module {}
