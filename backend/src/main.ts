import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setGlobalPrefix MUST be called very early. 
  // We exclude 'health' so we can verify the app is alive even if the prefix logic fails.
  app.setGlobalPrefix('api', { exclude: ['health'] });

  // High-priority middleware
  app.use(helmet());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    errorHttpStatusCode: 422 // More descriptive for validation errors
  }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();
