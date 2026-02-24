import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  async ping() {
    try {
      // Check database connectivity
      const userCount = await this.appService.getDbStatus();
      return {
        status: 'alive',
        version: '1.0.5',
        db: 'connected',
        users: userCount,
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      return {
        status: 'alive',
        version: '1.0.5',
        db: 'disconnected',
        error: e.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('health')
  health() {
    return { status: 'ok', message: 'Root health check (not prefixed)', version: '1.0.5' };
  }
}
