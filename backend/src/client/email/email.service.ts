import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_SMTP_HOST'),
      port: this.configService.get<number>('EMAIL_SMTP_PORT'),
      secure: this.configService.get<string>('EMAIL_SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('EMAIL_SMTP_USER'),
        pass: this.configService.get<string>('EMAIL_SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const serverUrl = this.configService.get<string>('SERVER_URL');
    const verificationLink = `${serverUrl}/api/auth/verify-email/${token}`;
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  }
}
