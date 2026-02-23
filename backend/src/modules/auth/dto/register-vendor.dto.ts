import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, IsArray } from 'class-validator';

export class RegisterVendorDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsNotEmpty()
    businessName: string;

    @IsString()
    @IsOptional()
    businessType?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsOptional()
    pincode?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    locality?: string;

    @IsString()
    @IsOptional()
    plotNo?: string;

    @IsString()
    @IsOptional()
    landmark?: string;

    @IsNumber()
    @IsOptional()
    yearsInBusiness?: number;

    @IsArray()
    @IsOptional()
    acquisitionChannels?: string[];

    @IsArray()
    @IsOptional()
    serviceCategories?: string[];

    @IsString()
    @IsOptional()
    eventVolume?: string;

    @IsString()
    @IsOptional()
    avgBookingPrice?: string;
}
