import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/user.entity';
import { Otp } from './otp.entity';
import { VendorProfile, BusinessType } from '../vendors/vendor-profile.entity';
import { SmsService } from '../sms/sms.service';
import { RegisterVendorDto } from './dto/register-vendor.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>,
        @InjectRepository(VendorProfile)
        private vendorProfileRepository: Repository<VendorProfile>,
        private jwtService: JwtService,
        private smsService: SmsService,
        private dataSource: DataSource,
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

        if (new Date() > otpRecord.expiresAt) {
            return false;
        }

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

        return { accessToken: this.generateToken(user), user };
    }

    async registerVendor(data: RegisterVendorDto): Promise<{ accessToken: string; vendor: User }> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const {
                email, password, phone, firstName, lastName,
                businessName, businessType, description, city, address,
                pincode, country, state, locality, plotNo, landmark,
                yearsInBusiness, acquisitionChannels, serviceCategories,
                eventVolume, avgBookingPrice
            } = data;

            // 1. Identity Verification
            const existing = await queryRunner.manager.findOne(User, {
                where: [{ email }, { phone }]
            });
            if (existing) {
                const field = existing.email === email ? 'Email' : 'Phone';
                throw new ConflictException(`${field} is already registered`);
            }

            // 2. Security: Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 3. Entity Creation (Atomic)
            const newUser = queryRunner.manager.create(User, {
                email,
                phone,
                firstName,
                lastName,
                password: hashedPassword,
                role: UserRole.VENDOR,
                isVerified: true,
                city: city || undefined,
            });

            const savedUser = await queryRunner.manager.save(newUser);

            const profile = queryRunner.manager.create(VendorProfile, {
                user: savedUser,
                businessName: businessName || 'My Business',
                businessType: (businessType as BusinessType) || BusinessType.INDIVIDUAL,
                description: description || '',
                city: city || '',
                address: address || '',
                pincode: pincode || '',
                country: country || 'India',
                state: state || '',
                locality: locality || '',
                plotNo: plotNo || '',
                landmark: landmark || '',
                yearsInBusiness: yearsInBusiness || 0,
                acquisitionChannels: acquisitionChannels || [],
                serviceCategories: serviceCategories || [],
                eventVolume: eventVolume || '',
                avgBookingPrice: avgBookingPrice || '',
            });
            await queryRunner.manager.save(profile);

            // 4. Commit transaction
            await queryRunner.commitTransaction();

            return {
                accessToken: this.generateToken(savedUser),
                vendor: savedUser
            };
        } catch (error) {
            // Rollback on any failure to prevent "ghost" users
            await queryRunner.rollbackTransaction();

            console.error('Senior Engine Alert: Vendor Registration Failed', {
                error: error.message,
                stack: error.stack,
                data: { ...data, password: '[REDACTED]' }
            });

            if (error instanceof ConflictException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Registration failed: ${error.message || 'Database transaction error'}`);
        } finally {
            await queryRunner.release();
        }
    }

    async loginWithPassword(email: string, pass: string): Promise<{ accessToken: string; vendor: Omit<User, 'password'> }> {
        // Need to explicitly select password since it has select: false in entity
        const user = await this.userRepository.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.password')
            .getOne();

        if (!user || user.role !== UserRole.VENDOR) {
            throw new UnauthorizedException('Invalid credentials or not a vendor');
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password, ...result } = user;
        return { accessToken: this.generateToken(user), vendor: result as User };
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            // We usually don't throw an error here to prevent email enumeration
            return;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 mins expiry for pwd reset

        // Save OTP using phone as an identifier for the OTP table for now, or email if we update the Otp entity.
        // Assuming Otp entity uses `phone` as a generic identifier string.
        await this.otpRepository.save({
            phone: email,
            code,
            expiresAt,
        });

        // Simulate sending email.
        console.log(`[Email Simulation] Password reset OTP for ${email} is: ${code}`);
    }

    async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
        // Check OTP
        const otpRecord = await this.otpRepository.findOne({
            where: { phone: email, code },
            order: { createdAt: 'DESC' },
        });

        if (!otpRecord || new Date() > otpRecord.expiresAt) {
            throw new BadRequestException('Invalid or expired reset code');
        }

        // Find user
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await this.userRepository.save(user);

        // Delete OTP
        await this.otpRepository.delete(otpRecord.id);

        return true;
    }

    generateToken(user: User): string {
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return this.jwtService.sign(payload);
    }
}
