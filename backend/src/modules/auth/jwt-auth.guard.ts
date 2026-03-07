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

    async canActivate(context: ExecutionContext) {
        this.isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        try {
            const result = await (super.canActivate(context) as Promise<boolean>);
            if (this.isPublicRoute) return true;
            return result;
        } catch (err) {
            if (this.isPublicRoute) return true;
            throw err;
        }
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
