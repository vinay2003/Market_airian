import { Controller, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

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

    @Patch('me')
    async updateSelf(@Request() req: any, @Body() body: any) {
        // Allowed fields for update
        const { firstName, lastName, city, interests, notificationPreferences, password } = body;
        const updateData: any = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (city !== undefined) updateData.city = city;
        if (interests !== undefined) updateData.interests = interests;
        if (notificationPreferences !== undefined) updateData.notificationPreferences = notificationPreferences;

        if (password) {
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(password, salt);
        }

        return this.usersService.update(req.user.id, updateData);
    }
}
