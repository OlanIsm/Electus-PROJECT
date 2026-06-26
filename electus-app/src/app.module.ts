import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatesModule } from './candidates/candidates.module';
import { Candidate } from './candidates/candidate.entity';
import { User } from './users/user.entity';
import { UserSession } from './users/user-session.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/notification.entity';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME', 'electus'),
        entities: [Candidate, User, UserSession, Notification],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CandidatesModule,
    UsersModule,
    AuthModule,
    NotificationsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
