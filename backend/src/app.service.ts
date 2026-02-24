import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './modules/users/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getDbStatus(): Promise<number> {
    return this.userRepository.count();
  }
}
