import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findOne(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        await this.userRepository.update(id, data);
        return this.findOne(id) as Promise<User>;
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async softDelete(id: string): Promise<void> {
        await this.userRepository.update(id, { isVerified: false });
    }
}
