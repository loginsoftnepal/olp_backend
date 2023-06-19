import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationService } from './authentication.service';
import { LocalStrategy } from './local.strategy';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AdminModule } from 'src/admin/admin.module';
import { EmailScheduleModule } from 'src/email-schedule/email-schedule.module';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { EmailVerificationModule } from 'src/email-verification/email-verification.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    AdminModule,
    EmailScheduleModule,
    EmailVerificationModule,
    AdminModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}m`,
        },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
