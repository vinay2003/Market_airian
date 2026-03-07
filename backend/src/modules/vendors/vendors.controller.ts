import { Controller, Post, Get, Body, UseGuards, Request, UploadedFile, UploadedFiles, UseInterceptors, Param, NotFoundException, BadRequestException, Delete, Patch, Query } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { UserRole } from '../users/user.entity';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { EventsService } from '../events/events.service';

import { UsersService } from '../users/users.service';
import { Public } from '../../common/public.decorator';

import { AuthService } from '../auth/auth.service';
import { CreateVendorProfileDto } from './dto/create-vendor-profile.dto';

@Controller('vendors')
export class VendorsController {
    constructor(
        private readonly vendorsService: VendorsService,
        private readonly usersService: UsersService,
        private readonly supabaseService: SupabaseService,
        private readonly authService: AuthService,
        private readonly eventsService: EventsService,
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('profile')
    @Roles(UserRole.VENDOR, UserRole.USER)
    async createOrUpdateProfile(@Request() req: any, @Body() body: CreateVendorProfileDto) {
        return this.vendorsService.createProfile(req.user, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('profile')
    @Roles(UserRole.VENDOR, UserRole.USER)
    async getProfile(@Request() req: any) {
        const profile = await this.vendorsService.getProfile(req.user);
        if (!profile) {
            throw new NotFoundException('Vendor profile not found');
        }
        return profile;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('stats')
    @Roles(UserRole.VENDOR)
    async getStats(@Request() req: any) {
        const profile = await this.vendorsService.getProfile(req.user);
        if (!profile) {
            throw new NotFoundException('Vendor profile not found');
        }

        const events = await this.eventsService.findByVendor(req.user.id);
        const now = new Date();
        const upcomingEvents = events.filter(e => new Date(e.date) > now);

        const sortedEvents = [...events].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return {
            totalBookings: events.length,
            upcomingEventsCount: upcomingEvents.length,
            profileViews: 0,
            profileViewsTrend: 0,
            recentBookings: sortedEvents.slice(0, 3)
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER, UserRole.VENDOR)
    @Get('public/:id')
    async getPublicProfile(@Param('id') id: string) {
        try {
            const profile = await this.vendorsService.getProfileById(id);
            if (!profile) {
                throw new NotFoundException('Vendor profile not found');
            }
            return profile;
        } catch (err) {
            throw err;
        }
    }

    @Public()
    @Get('public')
    async getAllPublicVendors(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('category') category?: string,
        @Query('city') city?: string,
        @Query('query') query?: string,
    ) {
        return this.vendorsService.getPublicVendors(
            parseInt(page) || 1,
            parseInt(limit) || 20,
            { category, city, query }
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('packages')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FilesInterceptor('images'))
    async addPackage(
        @Request() req: any,
        @Body() body: any,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const imageUrls: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const fileName = `${Date.now()}-${file.originalname}`;
                const url = await this.supabaseService.uploadFile(file, 'packages', fileName);
                imageUrls.push(url);
            }
        }

        return this.vendorsService.addPackage(req.user, {
            ...body,
            images: imageUrls,
            features: typeof body.features === 'string' ? JSON.parse(body.features) : body.features
        });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('packages/:id')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FilesInterceptor('images'))
    async updatePackage(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const imageUrls = body.existingImages ? (typeof body.existingImages === 'string' ? JSON.parse(body.existingImages) : body.existingImages) : [];
        if (files && files.length > 0) {
            for (const file of files) {
                const fileName = `${Date.now()}-${file.originalname}`;
                const url = await this.supabaseService.uploadFile(file, 'packages', fileName);
                imageUrls.push(url);
            }
        }

        return this.vendorsService.updatePackage(req.user, id, {
            ...body,
            images: imageUrls,
            features: typeof body.features === 'string' ? JSON.parse(body.features) : body.features
        });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('packages/:id')
    @Roles(UserRole.VENDOR)
    async deletePackage(@Request() req: any, @Param('id') id: string) {
        return this.vendorsService.deletePackage(req.user, id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('upload-logo')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FileInterceptor('logo'))
    async uploadLogo(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        if (!file) throw new BadRequestException('No file uploaded');
        const fileName = `logo-${req.user.id}-${Date.now()}`;
        const url = await this.supabaseService.uploadFile(file, 'logos', fileName);
        await this.vendorsService.updateProfile(req.user, { logoUrl: url });
        return { url };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('upload-banner')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FileInterceptor('banner'))
    async uploadBanner(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        if (!file) throw new BadRequestException('No file uploaded');
        const fileName = `banner-${req.user.id}-${Date.now()}`;
        const url = await this.supabaseService.uploadFile(file, 'banners', fileName);
        await this.vendorsService.updateProfile(req.user, { bannerUrl: url });
        return { url };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('gallery')
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FileInterceptor('file'))
    async addGalleryItem(
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any,
        @Body('type') type: string
    ) {
        if (!file) throw new BadRequestException('No file uploaded');
        const fileName = `gallery-${req.user.id}-${Date.now()}`;
        const url = await this.supabaseService.uploadFile(file, 'gallery', fileName);
        return this.vendorsService.addGalleryItem(req.user, url, type as any);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('gallery/:id')
    @Roles(UserRole.VENDOR)
    async deleteGalleryItem(@Request() req: any, @Param('id') id: string) {
        return this.vendorsService.deleteGalleryItem(req.user, id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('saved/:id')
    @Roles(UserRole.USER, UserRole.VENDOR)
    async saveVendor(@Request() req: any, @Param('id') id: string) {
        return this.vendorsService.saveVendor(req.user, id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('saved/:id')
    @Roles(UserRole.USER, UserRole.VENDOR)
    async unsaveVendor(@Request() req: any, @Param('id') id: string) {
        return this.vendorsService.unsaveVendor(req.user, id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('saved')
    @Roles(UserRole.USER, UserRole.VENDOR)
    async getSavedVendors(@Request() req: any) {
        return this.vendorsService.getSavedVendors(req.user);
    }
}
