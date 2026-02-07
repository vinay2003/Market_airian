import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('onboarding')
    @Roles(UserRole.USER)
    async onboarding(@Request() req: any, @Body() body: any) {
        return this.usersService.update(req.user.id, {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            city: body.city,
            interests: body.interests,
        });
    }
}
