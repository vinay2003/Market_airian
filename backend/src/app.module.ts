import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { EventsModule } from './modules/events/events.module'; // Added this import

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ConfigHostModule, // This was in the provided Code Edit, but not imported. Assuming it's a typo or needs an import that wasn't provided. Omitting to keep syntactically correct.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({ // Added async
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // Changed from `synchronize: true, // Disable in production`
        dropSchema: true, // Changed from `dropSchema: true, // Temporary dev reset` to `dropSchema: true, // DEV ONLY`
        ssl: { rejectUnauthorized: false }, // Added this line
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    VendorsModule,
    EventsModule, // Added this module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
