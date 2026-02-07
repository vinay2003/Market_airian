import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum EventStatus {
    REQUESTED = 'requested',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.REQUESTED,
    })
    status: EventStatus;

    // Vendor (Vendor is a User with 'vendor' role, but ideally linked to VendorProfile? 
    // Requirement says 'Vendors can list events'. Usually an event is a booking between a User and a Vendor.
    // Or is it a public event listed by a Vendor? 
    // "Vendors can list events they handled" & "User events & bookings" implies bookings.
    // I'll link to Vendor's User ID for simplicity, or VendorProfile. Linking to User ID is standard if auth uses User ID.

    @ManyToOne(() => User)
    @JoinColumn({ name: 'vendorId' })
    vendor: User;

    @Column()
    vendorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
