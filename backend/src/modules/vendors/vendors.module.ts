import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { VendorProfile } from './vendor-profile.entity';
import { SupabaseModule } from '../../common/supabase/supabase.module';
import { UsersModule } from '../users/users.module';
import { VendorPackage } from './entities/vendor-package.entity';
import { VendorGallery } from './entities/vendor-gallery.entity';
import { SavedVendor } from './entities/saved-vendor.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([VendorProfile, VendorPackage, VendorGallery, SavedVendor]),
        SupabaseModule,
        UsersModule,
        AuthModule,
    ],
    providers: [VendorsService],
    controllers: [VendorsController],
    exports: [VendorsService],
})
export class VendorsModule { }
