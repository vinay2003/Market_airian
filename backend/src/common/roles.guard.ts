import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../modules/users/user.entity';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        console.log(`RolesGuard: User ID ${user?.id} has Role: ${user?.role}. Required: ${JSON.stringify(requiredRoles)}`);

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            console.warn(`RolesGuard: Access Denied. User role '${user.role}' not in ${JSON.stringify(requiredRoles)}`);
        }
        return hasRole;
    }
}
