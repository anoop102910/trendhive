import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './auth.dto';
import { JwtAuthGuard } from '../guards/jwt.auth-guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userInput: RegisterDto) {
    const result = await this.authService.register(userInput);
    return {
      statusCode: HttpStatus.OK,
      message: 'User registered successfully',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginDto) {
    const result = await this.authService.login(email, password);
    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: result,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() { token }: RefreshTokenDto) {
    const result = await this.authService.refreshToken(token);
    return {
      statusCode: HttpStatus.OK,
      message: 'Token refreshed successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    const user = await this.authService.getProfile(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User profile fetched successfully',
      data: user,
    };
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
    return {
      statusCode: HttpStatus.OK,
      message: 'Email verified successfully',
    };
  }
}
