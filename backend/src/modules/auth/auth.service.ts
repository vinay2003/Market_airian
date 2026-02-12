import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/user.entity';
import { Otp } from './otp.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>,
        private jwtService: JwtService,
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

        console.log(`[MOCK SMS] OTP for ${phone}: ${code}`);
    }

    async login(phone: string, role: UserRole): Promise<{ accessToken: string; user: User }> {
        let user = await this.userRepository.findOne({ where: { phone } });

        if (!user) {
            user = this.userRepository.create({ phone, role, isVerified: true });
            await this.userRepository.save(user);
        } else if (user.role !== role) {
            // Update role if user is logging in with a different role context
            user.role = role;
            await this.userRepository.save(user);
        }
        // No else block: if user exists and role matches, we skip the save(), reducing latency.

        const payload = { sub: user.id, phone: user.phone, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken, user };
    }

    generateToken(user: User): string {
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return this.jwtService.sign(payload);
    }
}
