// src/config/validation.ts
import { z } from 'zod';

export const envSchema = z
  .object({
    CLIENT_URL: z.string().url(),

    JWT_ACCESS_TOKEN_EXPIRATION_TIME: z.string(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: z.string(),
    JWT_ACCESS_TOKEN_SECRET: z.string(),
    JWT_REFRESH_TOKEN_SECRET: z.string(),
    VERIFICATION_EXPIRATION_TIME: z.string(),

    MONGODB_URI: z.string().url(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.string(),

    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_USER: z.string().email(),
    SMTP_PASS: z.string(),
    FROM_EMAIL: z.string().email(),
    SERVER_URL: z.string().url(),

    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DATABASE_URL: z.string().url(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),

    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),
    AWS_S3_ENDPOINT: z.string().url(),
    AWS_PRESIGNED_URL_EXPIRATION: z.string(),
  })
  .strict();
