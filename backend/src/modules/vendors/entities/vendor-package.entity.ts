import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VendorProfile } from '../vendor-profile.entity';

@Entity('vendor_packages')
export class VendorPackage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // e.g. "Gold Package", "Standard Room"

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'simple-array', nullable: true })
    features: string[]; // List of inclusions

    @Column({ type: 'simple-array', nullable: true })
    images: string[];

    @Column({ nullable: true })
    category: string; // e.g. "Photography", "Catering"

    @Column({ nullable: true })
    tier: string; // "Basic", "Standard", "Premium"

    @Column({ default: true })
    active: boolean;

    @ManyToOne(() => VendorProfile, (vendor) => vendor.packages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    vendor: VendorProfile;

    @Column()
    vendorId: string;
}
