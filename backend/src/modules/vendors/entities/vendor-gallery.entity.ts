import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { VendorProfile } from '../vendor-profile.entity';

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
}

@Entity('vendor_gallery')
export class VendorGallery {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({
        type: 'enum',
        enum: MediaType,
        default: MediaType.IMAGE
    })
    type: MediaType;

    @Exclude()
    @ManyToOne(() => VendorProfile, (vendor) => vendor.gallery, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    vendor: VendorProfile;

    @Column()
    vendorId: string;

    @CreateDateColumn()
    createdAt: Date;
}
