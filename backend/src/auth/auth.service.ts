import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { UserDao } from './user.dao';
import { CodeEnum } from './auth.code';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../client/email/email.service';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDao: UserDao,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userDao.findByEmail(email);
    if (!user) {
      throw new NotFoundException({
        message: 'Invalid credentials',
        code: CodeEnum.INVALID_CREDENTIALS,
      });
    }
    if (!user.isEmailVerified) {
      return await this.resendVerificationEmail(user);
    }
    const isValidPassword = await this.checkPassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        code: CodeEnum.INVALID_CREDENTIALS,
      });
    }
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      ) as jwt.JwtPayload;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        code: CodeEnum.INVALID_TOKEN,
      });
    }
    const user = await this.userDao.findById(decoded.userId);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        code: CodeEnum.USER_NOT_FOUND,
      });
    }
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async register(userInput: RegisterDto) {
    const existingUser = await this.userDao.findByEmail(userInput.email);
    if (existingUser && !existingUser.isEmailVerified) {
      return await this.resendVerificationEmail(existingUser);
    }
    if (existingUser) {
      throw new BadRequestException({
        message: 'User already exists',
        code: CodeEnum.USER_ALREADY_EXISTS,
      });
    }
    const hashedPassword = await this.hashPassword(userInput.password!);
    const user = await this.userDao.createUser({
      ...userInput,
      password: hashedPassword,
    });
    return await this.resendVerificationEmail(user);
  }

  async verifyEmail(token: string) {
    const user = await this.userDao.getUserByVerificationToken(token);
    if (!user) {
      throw new BadRequestException({
        message: 'Invalid or expired verification token',
        code: CodeEnum.INVALID_VERIFICATION_TOKEN,
      });
    }
    await this.userDao.markEmailAsVerified(user.id);
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.userDao.findByIdWithoutPassword(userId);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        code: CodeEnum.USER_NOT_FOUND,
      });
    }
    return user;
  }

  private generateAccessToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')!,
      {
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      },
    );
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')!,
      {
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      },
    );
  }

  private async resendVerificationEmail(user: any) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await this.userDao.updateVerificationToken(user.id, verificationToken);
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );
    return {
      message: 'Verification email sent successfully',
      code: CodeEnum.VERIFICATION_EMAIL_SENT,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
