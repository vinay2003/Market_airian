import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: (exception as Error).message || 'Internal server error' };

        // Critical logging for production troubleshooting
        this.logger.error(
            `Status: ${status} Error: ${JSON.stringify(message)} Path: ${request.url} Stack: ${(exception as Error).stack}`,
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(typeof message === 'object' ? message : { message }),
            // In production, we don't want to leak stack traces, but the message can help
            debug: process.env.NODE_ENV !== 'production' ? (exception as Error).stack : 'See server logs'
        });
    }
}
