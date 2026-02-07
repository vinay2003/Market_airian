import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './event.entity';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
    ) { }

    // Create event (User requests a booking)
    async create(userId: string, vendorId: string, data: Partial<Event>): Promise<Event> {
        const event = this.eventRepository.create({
            ...data,
            userId,
            vendorId,
            status: EventStatus.REQUESTED,
        });
        return this.eventRepository.save(event);
    }

    // Get events for a user
    async findByUser(userId: string): Promise<Event[]> {
        return this.eventRepository.find({
            where: { userId },
            relations: ['vendor'], // To show vendor name
            order: { date: 'DESC' },
        });
    }

    // Get events for a vendor
    async findByVendor(vendorId: string): Promise<Event[]> {
        return this.eventRepository.find({
            where: { vendorId },
            relations: ['user'], // To show user name
            order: { date: 'DESC' },
        });
    }

    // Update status (Vendor confirms/completes)
    async updateStatus(id: string, status: EventStatus): Promise<Event> {
        await this.eventRepository.update(id, { status });
        return this.eventRepository.findOne({ where: { id } }) as Promise<Event>;
    }
}
