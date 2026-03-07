import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorProfile } from './vendor-profile.entity';
import { User } from '../users/user.entity';
import { VendorPackage } from './entities/vendor-package.entity';
import { VendorGallery, MediaType } from './entities/vendor-gallery.entity';
import { SavedVendor } from './entities/saved-vendor.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(VendorProfile)
        private vendorRepository: Repository<VendorProfile>,
        @InjectRepository(VendorPackage)
        private packageRepository: Repository<VendorPackage>,
        @InjectRepository(VendorGallery)
        private galleryRepository: Repository<VendorGallery>,
        @InjectRepository(SavedVendor)
        private savedVendorRepository: Repository<SavedVendor>,
    ) { }

    async createProfile(user: User, data: any): Promise<VendorProfile> {
        const existingProfile = await this.getProfile(user);

        // Handle User info updates if passed
        if (data.firstName || data.lastName) {
            await this.vendorRepository.manager.update(User, user.id, {
                ...(data.firstName && { firstName: data.firstName }),
                ...(data.lastName && { lastName: data.lastName }),
            });
        }

        // Filter out User-specific fields that aren't in VendorProfile
        const { firstName, lastName, email, ...profileData } = data;

        if (existingProfile) {
            Object.assign(existingProfile, profileData);
            return this.vendorRepository.save(existingProfile);
        }

        const profile = this.vendorRepository.create({ ...profileData, user } as any) as unknown as VendorProfile;
        return this.vendorRepository.save(profile);
    }

    async getProfile(user: User): Promise<VendorProfile | null> {
        return this.vendorRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['packages', 'gallery']
        });
    }

    async updateProfile(user: User, data: Partial<VendorProfile>): Promise<VendorProfile> {
        await this.vendorRepository.update({ user: { id: user.id } }, data);
        const updated = await this.getProfile(user);
        if (!updated) throw new NotFoundException('Profile not found');
        return updated;
    }

    async getProfileById(id: string): Promise<VendorProfile | null> {
        return this.vendorRepository.findOne({
            where: { id },
            relations: ['user', 'packages', 'gallery']
        });
    }

    async getPublicVendors(
        page: number = 1,
        limit: number = 20,
        filters?: { category?: string; city?: string; query?: string }
    ): Promise<{ data: VendorProfile[], total: number }> {
        const queryBuilder = this.vendorRepository.createQueryBuilder('vendor')
            .leftJoinAndSelect('vendor.user', 'user')
            .leftJoinAndSelect('vendor.packages', 'packages')
            .leftJoinAndSelect('vendor.gallery', 'gallery')
            .where('1=1');

        if (filters?.category) {
            queryBuilder.andWhere('vendor.serviceCategories LIKE :category', { category: `%${filters.category}%` });
        }

        if (filters?.city) {
            queryBuilder.andWhere('LOWER(vendor.city) = LOWER(:city)', { city: filters.city });
        }

        if (filters?.query) {
            queryBuilder.andWhere(
                '(vendor.businessName ILIKE :query OR vendor.description ILIKE :query OR vendor.city ILIKE :query OR vendor.serviceCategories ILIKE :query)',
                { query: `%${filters.query}%` }
            );
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { data, total };
    }

    // Packages
    async addPackage(user: User, data: Partial<VendorPackage>): Promise<VendorPackage> {
        const vendor = await this.getProfile(user);
        if (!vendor) throw new BadRequestException('Vendor profile not found');
        const pkg = this.packageRepository.create({ ...data, vendor });
        return this.packageRepository.save(pkg);
    }

    async deletePackage(user: User, packageId: string): Promise<void> {
        const vendor = await this.getProfile(user);
        if (!vendor) return;
        const pkg = await this.packageRepository.findOne({ where: { id: packageId, vendor: { id: vendor.id } } });
        if (pkg) await this.packageRepository.remove(pkg);
    }

    async updatePackage(user: User, packageId: string, data: Partial<VendorPackage>): Promise<VendorPackage> {
        const vendor = await this.getProfile(user);
        if (!vendor) throw new BadRequestException('Vendor profile not found');

        const pkg = await this.packageRepository.findOne({ where: { id: packageId, vendor: { id: vendor.id } } });
        if (!pkg) throw new NotFoundException('Package not found');

        Object.assign(pkg, data);
        return this.packageRepository.save(pkg);
    }

    // Gallery
    async addGalleryItem(user: User, url: string, type: MediaType): Promise<VendorGallery> {
        const vendor = await this.getProfile(user);
        if (!vendor) throw new BadRequestException('Vendor profile not found');
        const item = this.galleryRepository.create({ url, type, vendor });
        return this.galleryRepository.save(item);
    }

    async deleteGalleryItem(user: User, mediaId: string): Promise<void> {
        const vendor = await this.getProfile(user);
        if (!vendor) return;
        const item = await this.galleryRepository.findOne({ where: { id: mediaId, vendor: { id: vendor.id } } });
        if (item) await this.galleryRepository.remove(item);
    }

    // Saved Vendors (User Side)
    async saveVendor(user: User, vendorId: string): Promise<SavedVendor> {
        const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
        if (!vendor) throw new NotFoundException('Vendor not found');

        const existing = await this.savedVendorRepository.findOne({ where: { user: { id: user.id }, vendor: { id: vendorId } } });
        if (existing) return existing;

        const saved = this.savedVendorRepository.create({ user, vendor });
        return this.savedVendorRepository.save(saved);
    }

    async unsaveVendor(user: User, vendorId: string): Promise<void> {
        const saved = await this.savedVendorRepository.findOne({ where: { user: { id: user.id }, vendor: { id: vendorId } } });
        if (saved) await this.savedVendorRepository.remove(saved);
    }

    async getSavedVendors(user: User): Promise<SavedVendor[]> {
        return this.savedVendorRepository.find({
            where: { user: { id: user.id } },
            relations: ['vendor', 'vendor.user']
        });
    }
}
