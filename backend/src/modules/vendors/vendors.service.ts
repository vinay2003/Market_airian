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

    async createProfile(user: User, data: Partial<VendorProfile>): Promise<VendorProfile> {
        const profile = this.vendorRepository.create({ ...data, user });
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
        return this.getProfile(user) as Promise<VendorProfile>;
    }

    async getProfileById(id: string): Promise<VendorProfile | null> {
        return this.vendorRepository.findOne({
            where: { id },
            relations: ['user', 'packages', 'gallery']
        });
    }

    async getPublicVendors(): Promise<VendorProfile[]> {
        return this.vendorRepository.find({
            where: {
                user: { isVerified: true }
            },
            relations: ['user', 'packages', 'gallery']
        });
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
