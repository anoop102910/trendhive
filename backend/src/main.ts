import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { ParseNestedQueryPipe } from './utils/parse-query-transformer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalPipes(new ParseNestedQueryPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
