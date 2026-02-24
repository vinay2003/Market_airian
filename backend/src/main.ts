import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const essentialEnv = ['DATABASE_URL', 'JWT_SECRET'];
  essentialEnv.forEach(env => {
    if (!process.env[env]) {
      console.error(`❌ CRITICAL ERROR: ${env} is not defined in environment variables.`);
      process.exit(1);
    }
  });

  const app = await NestFactory.create(AppModule);

  // setGlobalPrefix MUST be called very early. 
  // We exclude 'health' so we can verify the app is alive even if the prefix logic fails.
  app.setGlobalPrefix('api', { exclude: ['health'] });

  // High-priority middleware
  app.use(helmet());
  app.enableCors({
    origin: [
      'https://www.airionsolutions.com',
      'https://airionsolutions.com',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    errorHttpStatusCode: 422
  }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`🚀 Senior Engine started on: ${url}`);
  console.log(`📌 Global Prefix: /api`);
  console.log(`🌐 Allowed Origins: airionsolutions.com, localhost`);
}

// Added better error handling at the bootstrap level
bootstrap().catch(err => {
  console.error('Fatal failure during bootstrap:', err);
  process.exit(1);
});
