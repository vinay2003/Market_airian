import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { VendorPackage } from './entities/vendor-package.entity';
import { VendorGallery } from './entities/vendor-gallery.entity';

export enum BusinessType {
    INDIVIDUAL = 'individual',
    COMPANY = 'company',
    AGENCY = 'agency',
}

@Entity('vendor_profiles')
export class VendorProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: true })
    businessName: string;

    @Column({
        type: 'enum',
        enum: BusinessType,
        default: BusinessType.INDIVIDUAL,
    })
    businessType: BusinessType;

    @Column({ nullable: true })
    gstNumber: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    pincode: string;

    @Column({ nullable: true })
    landmark: string;

    @Column({ type: 'int', nullable: true })
    yearsInBusiness: number;

    @Column({ type: 'simple-array', nullable: true })
    acquisitionChannels: string[];

    @Column({ type: 'simple-array', nullable: true })
    serviceCategories: string[];

    @Column({ nullable: true })
    eventVolume: string; // e.g., '1-5', '6-20', '20+'

    @Column({ nullable: true })
    avgBookingPrice: string;

    @Column({ type: 'text', nullable: true })
    packagesOffered: string; // Stored as JSON string or text

    @Column({ type: 'text', nullable: true })
    challenges: string;

    @Column({ type: 'text', nullable: true })
    platformInterest: string;

    @Column({ nullable: true })
    preferredPricing: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ nullable: true })
    bannerUrl: string;

    @Column({ type: 'text', nullable: true })
    termsAndConditions: string;

    @Column({ type: 'simple-json', nullable: true })
    locations: { address: string; city: string; pincode?: string; landmark?: string; mapUrl?: string }[];

    @Column({ type: 'simple-json', nullable: true })
    socialLinks: { instagram?: string; website?: string; facebook?: string };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => VendorPackage, (pkg) => pkg.vendor, { cascade: true })
    packages: VendorPackage[];

    @OneToMany(() => VendorGallery, (media) => media.vendor, { cascade: true })
    gallery: VendorGallery[];
}
