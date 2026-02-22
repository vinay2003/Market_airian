import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('send-otp')
    async sendOtp(@Body('phone') phone: string) {
        // Asynchronous call - does not block response
        this.authService.sendOtp(phone);
        return { message: 'OTP sent successfully', success: true };
    }

    @Post('verify')
    async verifyOtp(
        @Body('phone') phone: string,
        @Body('otp') otp: string,
        @Body('role') role: UserRole,
    ) {
        const isValid = await this.authService.verifyOtp(phone, otp);
        if (!isValid) {
            return { success: false, message: 'Invalid or expired OTP' };
        }

        // If valid, proceed to login/signup
        return this.authService.login(phone, role);
    }

    @Post('register-vendor')
    async registerVendor(@Body() body: any) {
        return this.authService.registerVendor(body);
    }

    @Post('login')
    async loginWithPassword(@Body() body: any) {
        return this.authService.loginWithPassword(body.email, body.password);
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        await this.authService.forgotPassword(email);
        return { message: 'If the email is registered, a reset code has been sent.', success: true };
    }

    @Post('reset-password')
    async resetPassword(@Body() body: any) {
        await this.authService.resetPassword(body.email, body.code, body.newPassword);
        return { message: 'Password reset successfully.', success: true };
    }
}
