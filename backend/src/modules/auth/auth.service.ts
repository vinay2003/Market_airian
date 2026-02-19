import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/user.entity';
import { Otp } from './otp.entity';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>,
        private jwtService: JwtService,
        private smsService: SmsService,
    ) { }

    async sendOtp(phone: string): Promise<void> {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await this.otpRepository.save({
            phone,
            code,
            expiresAt,
        });

        // Don't await SMS sending to prevent blocking the response
        this.smsService.sendOtp(phone, code).catch(err => {
            console.error(`Failed to send SMS to ${phone}`, err);
        });
    }

    async verifyOtp(phone: string, code: string): Promise<boolean> {
        const otpRecord = await this.otpRepository.findOne({
            where: { phone, code },
            order: { createdAt: 'DESC' },
        });

        if (!otpRecord) {
            return false;
        }

        // Check expiry (e.g. 5 mins)
        if (new Date() > otpRecord.expiresAt) {
            return false;
        }

        // Optional: Delete OTP after usage to prevent replay
        await this.otpRepository.delete(otpRecord.id);

        return true;
    }

    async login(phone: string, role: UserRole): Promise<{ accessToken: string; user: User }> {
        let user = await this.userRepository.findOne({ where: { phone } });

        if (!user) {
            user = this.userRepository.create({ phone, role, isVerified: true });
            await this.userRepository.save(user);
        } else if (user.role !== role) {
            user.role = role;
            await this.userRepository.save(user);
        }

        const payload = { sub: user.id, phone: user.phone, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken, user };
    }

    generateToken(user: User): string {
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return this.jwtService.sign(payload);
    }
}
