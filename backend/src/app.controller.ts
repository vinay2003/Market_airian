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
  ping() {
    return { status: 'alive', version: '1.0.3', timestamp: new Date().toISOString(), prefix: '/api' };
  }

  @Get('health')
  health() {
    return { status: 'ok', message: 'Root health check (not prefixed)', version: '1.0.3' };
  }
}
