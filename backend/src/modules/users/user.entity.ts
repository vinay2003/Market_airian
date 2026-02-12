import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    VENDOR = 'vendor',
    USER = 'user',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    city: string;

    @Column({ type: 'simple-array', nullable: true })
    interests: string[];

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true, select: false }) // Select false to not return by default
    password: string;

    @Column({ type: 'simple-json', nullable: true })
    notificationPreferences: {
        email: boolean;
        sms: boolean;
        bookingUpdates: boolean;
        marketing: boolean;
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
