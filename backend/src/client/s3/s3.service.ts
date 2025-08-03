import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly bucketName: string;

  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME')!;
  }

  async generatePresignedPutUrl(
    objectKey: string,
    contentType: string,
    expiresIn: number = 3600,
    bucketName: string = this.bucketName,
  ): Promise<string> {
    const putCommandInput: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(putCommandInput);

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      this.logger.log(`Presigned PUT URL generated for object: ${objectKey}`);
      return url;
    } catch (error) {
      this.logger.error(
        `Error generating presigned PUT URL for ${objectKey}:`,
        error.stack,
      );
      throw new HttpException(
        'Failed to generate presigned upload URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generatePresignedGetUrl(
    objectKey: string,
    expiresIn: number = 3600,
    bucketName: string = this.bucketName,
  ): Promise<string> {
    const getCommandInput: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: objectKey,
    };

    const command = new GetObjectCommand(getCommandInput);

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      this.logger.log(`Presigned GET URL generated for object: ${objectKey}`);
      return url;
    } catch (error) {
      this.logger.error(
        `Error generating presigned GET URL for ${objectKey}:`,
        error.stack,
      );
      throw new HttpException(
        'Failed to generate presigned download URL',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async removeFile(
    objectKey: string,
    bucketName: string = this.bucketName,
  ): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      });
      await this.s3Client.send(deleteCommand);
      this.logger.log(
        `Object '${objectKey}' removed successfully from bucket '${bucketName}'.`,
      );
    } catch (error) {
      this.logger.error(`Error removing object '${objectKey}':`, error.stack);
      throw new HttpException(
        'Failed to remove object from storage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
