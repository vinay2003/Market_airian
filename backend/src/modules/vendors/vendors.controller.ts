import { Controller, Post, Get, Body, UseGuards, Request, UploadedFile, UploadedFiles, UseInterceptors, Param, NotFoundException, BadRequestException, Delete, Patch } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { UserRole } from '../users/user.entity';
import { SupabaseService } from '../../common/supabase/supabase.service';

import { UsersService } from '../users/users.service';
import { Public } from '../../common/public.decorator';

import { AuthService } from '../auth/auth.service';
import { CreateVendorProfileDto } from './dto/create-vendor-profile.dto';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
    constructor(
        private readonly vendorsService: VendorsService,
        private readonly usersService: UsersService,
        private readonly supabaseService: SupabaseService,
        private readonly authService: AuthService,
    ) { }

    @Post('profile')
    @Roles(UserRole.VENDOR, UserRole.USER)
    async createOrUpdateProfile(@Request() req: any, @Body() body: CreateVendorProfileDto) {
        const { firstName, lastName, email, ...vendorData } = body;

        // Update User details if provided
        if (firstName || lastName || email) {
            await this.usersService.update(req.user.id, {
                firstName,
                lastName,
                email
            });
        }

        const existing = await this.vendorsService.getProfile(req.user);
        let profile;
        if (existing) {
            profile = await this.vendorsService.updateProfile(req.user, vendorData);
        } else {
            profile = await this.vendorsService.createProfile(req.user, vendorData);
        }

        const currentUser = await this.usersService.findOne(req.user.id);
        if (!currentUser) {
            throw new NotFoundException('User not found');
        }

        let accessToken: string | null = null;

        // Ensure user has VENDOR role
        if (currentUser.role !== UserRole.VENDOR) {
            await this.usersService.update(currentUser.id, { role: UserRole.VENDOR });
            currentUser.role = UserRole.VENDOR;
            // Generate new token with VENDOR role
            accessToken = this.authService.generateToken(currentUser);
        }

        return { ...profile, accessToken, user: currentUser };
    }

    @Get('profile')
    @Roles(UserRole.VENDOR)
    async getProfile(@Request() req: any) {
        return this.vendorsService.getProfile(req.user);
    }

    @Get('public/:id')
    @Public()
    async getPublicProfile(@Param('id') id: string) {
        const profile = await this.vendorsService.getProfileById(id);
        if (!profile) {
            throw new NotFoundException('Vendor profile not found');
        }
        return profile;
    }

    @Get('public')
    @Public()
    async getAllPublicVendors() {
        // Find all verified vendors, optionally with some required profile completeness
        const vendors = await this.vendorsService.getPublicVendors();
        // Prevent listing vendors missing critical info
        return vendors.filter(v => v.businessName && v.city);
    }

    @Get('packages')
    @Roles(UserRole.VENDOR)
    async getPackages(@Request() req: any) {
        const profile = await this.vendorsService.getProfile(req.user);
        if (!profile) {
            throw new NotFoundException('Vendor profile not found');
        }
        return profile.packages || [];
    }

    @Post('packages')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FilesInterceptor('images', 5)) // Max 5 images
    async addPackage(@Request() req: any, @Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>) {
        const packageData = { ...body };
        // If features is array or string, handle it. Frontend sends form-data, so it might be string
        if (typeof packageData.features === 'string') {
            if (packageData.features.includes(',')) {
                packageData.features = packageData.features.split(',').map((f: string) => f.trim());
            } else {
                packageData.features = [packageData.features];
            }
        }

        const imageUrls: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const url = await this.supabaseService.uploadFile(file, 'vendor-assets', `packages/${req.user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`);
                imageUrls.push(url);
            }
        }
        packageData.images = imageUrls;

        return this.vendorsService.addPackage(req.user, packageData);
    }

    @Patch('packages/:id')
    @UseInterceptors(FilesInterceptor('images', 5))
    @Roles(UserRole.VENDOR)
    async updatePackage(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        const packageData = { ...body };
        if (typeof packageData.features === 'string') {
            if (packageData.features.includes(',')) {
                packageData.features = packageData.features.split(',').map((f: string) => f.trim());
            } else {
                packageData.features = [packageData.features];
            }
        }

        const imageUrls: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const url = await this.supabaseService.uploadFile(file, 'vendor-assets', `packages/${req.user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`);
                imageUrls.push(url);
            }
        }

        let finalImages: string[] = [];
        if (body.existingImages) {
            finalImages = Array.isArray(body.existingImages) ? body.existingImages : [body.existingImages];
        }
        finalImages = [...finalImages, ...imageUrls];
        packageData.images = finalImages;

        return this.vendorsService.updatePackage(req.user, id, packageData);
    }

    @Delete('packages/:id')
    @Roles(UserRole.VENDOR)
    async deletePackage(@Request() req: any, @Param('id') id: string) {
        return this.vendorsService.deletePackage(req.user, id);
    }

    @Post('upload-logo')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FileInterceptor('file'))
    async uploadLogo(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const url = await this.supabaseService.uploadFile(file, 'vendor-assets', `logos/${req.user.id}-${Date.now()}`);
        return this.vendorsService.updateProfile(req.user, { logoUrl: url });
    }

    @Post('upload-banner')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FileInterceptor('file'))
    async uploadBanner(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const url = await this.supabaseService.uploadFile(file, 'vendor-assets', `banners/${req.user.id}-${Date.now()}`);
        return this.vendorsService.updateProfile(req.user, { bannerUrl: url });
    }

    @Post('gallery')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FileInterceptor('file'))
    async addGalleryItem(@UploadedFile() file: Express.Multer.File, @Request() req: any, @Body('type') type: string) {
        if (!file) throw new BadRequestException('File is required');
        // Determine type based on mimetype if not provided, default to image
        const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
        // We cast string to any to bypass the enum check for now, service handles it

        const url = await this.supabaseService.uploadFile(file, 'vendor-assets', `gallery/${req.user.id}-${Date.now()}`);
        return this.vendorsService.addGalleryItem(req.user, url, mediaType as any);
    }

    @Delete('gallery/:id')
    @Roles(UserRole.VENDOR)
    async deleteGalleryItem(@Request() req: any, @Param('id') id: string) {
        return this.vendorsService.deleteGalleryItem(req.user, id);
    }

    // User Actions
    @Post(':id/save')
    @Roles(UserRole.USER)
    async saveVendor(@Request() req: any, @Param('id') id: string) {
        return this.vendorsService.saveVendor(req.user, id);
    }

    @Delete(':id/save')
    @Roles(UserRole.USER)
    async unsaveVendor(@Request() req: any, @Param('id') id: string) {
        return this.vendorsService.unsaveVendor(req.user, id);
    }

    @Get('saved')
    @Roles(UserRole.USER)
    async getSavedVendors(@Request() req: any) {
        return this.vendorsService.getSavedVendors(req.user);
    }
}
