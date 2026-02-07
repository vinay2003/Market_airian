import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column, Unique } from 'typeorm';
import { User } from '../../users/user.entity';
import { VendorProfile } from '../vendor-profile.entity';

@Entity('saved_vendors')
@Unique(['userId', 'vendorId'])
export class SavedVendor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => VendorProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    vendor: VendorProfile;

    @Column()
    vendorId: string;

    @CreateDateColumn()
    savedAt: Date;
}
