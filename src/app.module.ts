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
import { ConnectionModule } from './connection/connection.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConnectionRequestsModule } from './connection-requests/connection-requests.module';
import { MessageModule } from './message/message.module';
import { MessageAttachmentsModule } from './message-attachments/message-attachments.module';
import { ConversationsModule } from './conversations/conversations.module';
import { EventsModule } from './events/events.module';
import { SocketwayModule } from './socketway/socketway.module';
import { SessionManagerModule } from './session-manager/session-manager.module';
import { WsAuthGuard } from './authentication/ws-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PeerModule } from './peer/peer.module';
import { CallModule } from './call/call.module';
import { NotificationModule } from './notification/notification.module';
import { BannerModule } from './banner/banner.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';

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
    ConnectionModule,
    EventEmitterModule.forRoot(),
    ConnectionRequestsModule,
    MessageModule,
    MessageAttachmentsModule,
    ConversationsModule,
    EventsModule,
    SocketwayModule,
    SessionManagerModule,
    PeerModule,
    CallModule,
    NotificationModule,
    BannerModule,
    EmailVerificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: WsAuthGuard,
    },
  ],
})
export class AppModule {}
