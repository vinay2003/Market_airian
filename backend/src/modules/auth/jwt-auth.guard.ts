import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    private isPublicRoute = false;

    canActivate(context: ExecutionContext) {
        this.isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Always call super.canActivate to try and populate the user
        // even for public routes. We'll handle the optionality in handleRequest.
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (this.isPublicRoute) {
            // For public routes, return the user if they were successfully authenticated,
            // but don't throw an error if they are missing or the token is invalid.
            return user || null;
        }

        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
