import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { UserRole } from '../users/user.entity';
import { EventStatus } from './event.entity';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @Roles(UserRole.USER)
    async create(@Request() req: any, @Body() body: any) {
        // Body should contain vendorId, title, date, description
        return this.eventsService.create(req.user.id, body.vendorId, body);
    }

    @Get('my-events')
    async getMyEvents(@Request() req: any) {
        if (req.user.role === UserRole.VENDOR) {
            return this.eventsService.findByVendor(req.user.id);
        }
        return this.eventsService.findByUser(req.user.id);
    }

    @Patch(':id/status')
    @Roles(UserRole.VENDOR) // Only vendors manage status for now
    async updateStatus(@Param('id') id: string, @Body('status') status: EventStatus) {
        return this.eventsService.updateStatus(id, status);
    }
}
