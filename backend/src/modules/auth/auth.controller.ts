import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('send-otp')
    async sendOtp(@Body('phone') phone: string) {
        await this.authService.sendOtp(phone);
        return { message: 'OTP sent successfully' };
    }

    @Post('login')
    async login(
        @Body('phone') phone: string,
        @Body('role') role: UserRole,
    ) {
        return this.authService.login(phone, role);
    }
}
