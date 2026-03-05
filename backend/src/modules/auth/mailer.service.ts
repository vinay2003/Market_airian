import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: Number(this.configService.get('MAIL_PORT')),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }

    async sendPasswordResetEmail(email: string, code: string) {
        const mailPass = this.configService.get('MAIL_PASS');
        if (!mailPass) {
            console.error('Email Error: MAIL_PASS is not configured in .env. Skipping email sending.');
            return;
        }

        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?email=${email}`;

        try {
            await this.transporter.sendMail({
                from: `"Airion Support" <${this.configService.get('MAIL_FROM')}>`,
                to: email,
                subject: 'Password Reset Request',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #1a202c;">Password Reset</h2>
                        <p>You requested a password reset. Use the code below to reset your password:</p>
                        <div style="background: #f7fafc; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 4px; margin: 20px 0;">
                            ${code}
                        </div>
                        <p>Or click the link below to go directly to the reset page:</p>
                        <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                        <p style="margin-top: 20px; font-size: 14px; color: #718096;">If you did not request this, please ignore this email.</p>
                    </div>
                `,
            });
            console.log(`Password reset email sent successfully to: ${email}`);
        } catch (error) {
            console.error('Nodemailer Error:', error.message);
            throw error;
        }
    }
}
