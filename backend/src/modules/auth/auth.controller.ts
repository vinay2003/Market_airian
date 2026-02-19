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
}
