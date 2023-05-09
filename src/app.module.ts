import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './profile/profile.module';
import { PreferanceModule } from './preferance/preferance.module';
import { PhotosModule } from './photos/photos.module';
import { GoogleAuthenticationModule } from './google-authentication/google-authentication.module';
import { EmailModule } from './email/email.module';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailScheduleModule } from './email-schedule/email-schedule.module';
import { UserAvatarModule } from './user-avatar/user-avatar.module';
import { ForgetPasswordModule } from './forget-password/forget-password.module';
import { FamilyModule } from './family/family.module';
import { EducationModule } from './education/education.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    PostsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_URL: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        CLIENT_URL: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthenticationModule,
    AdminModule,
    ProfileModule,
    PreferanceModule,
    PhotosModule,
    GoogleAuthenticationModule,
    EmailModule,
    EmailScheduleModule,
    UserAvatarModule,
    ForgetPasswordModule,
    FamilyModule,
    EducationModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthenticationService],
})
export class AppModule {}
