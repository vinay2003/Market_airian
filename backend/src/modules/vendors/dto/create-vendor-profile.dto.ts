import { IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessType } from '../vendor-profile.entity';

class LocationDto {
    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    pincode?: string;

    @IsOptional()
    @IsString()
    landmark?: string;

    @IsOptional()
    @IsString()
    mapUrl?: string;
}

class SocialLinksDto {
    @IsOptional()
    @IsString()
    instagram?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @IsString()
    facebook?: string;
}

export class CreateVendorProfileDto {
    @IsOptional()
    @IsString()
    businessName?: string;

    @IsOptional()
    @IsEnum(BusinessType)
    businessType?: BusinessType;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    gstNumber?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    pincode?: string;

    @IsOptional()
    @IsString()
    landmark?: string;

    @IsOptional()
    @IsNumber()
    yearsInBusiness?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    acquisitionChannels?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    serviceCategories?: string[];

    @IsOptional()
    @IsString()
    eventVolume?: string;

    @IsOptional()
    @IsString()
    avgBookingPrice?: string;

    @IsOptional()
    @IsString()
    packagesOffered?: string;

    @IsOptional()
    @IsString()
    challenges?: string;

    @IsOptional()
    @IsString()
    platformInterest?: string;

    @IsOptional()
    @IsString()
    preferredPricing?: string;

    @IsOptional()
    @IsString()
    termsAndConditions?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    locality?: string;

    @IsOptional()
    @IsString()
    plotNo?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LocationDto)
    locations?: LocationDto[];

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;

    // User update fields (optional, passed in same body by frontend)
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    email?: string;
}
