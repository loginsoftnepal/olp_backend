import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from 'src/users/user.entity';
import Post from 'src/posts/posts.entity';
import Admin from 'src/admin/admin.entity';
import Photos from 'src/photos/photos.entity';
import Preferance from 'src/preferance/preferance.entity';
import Profile from 'src/profile/profile.entity';
import UserAvatar from 'src/user-avatar/user-avatar.entity';
import { ForgetPassword } from 'src/forget-password/forget-password.entity';
import Family from 'src/family/family.entity';
import EducationEntity from 'src/education/education.entity';
import { Connection } from 'src/connection/connection.entity';
import { ConnectionRequest } from 'src/connection-requests/connection-request.entity';
import { Message } from 'src/message/message.entity';
import { MessageAttachment } from 'src/message-attachments/message-attachments.entity';
import { Conversation } from 'src/conversations/conversation.entity';
import { Peer } from 'src/peer/peer.entity';
import Notification from 'src/notification/notification.entity';
import { Call } from 'src/call/call.entity';
import Banner from 'src/banner/banner.entity';
import { EmailVerification } from 'src/email-verification/email-verification.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URL'),
        entities: [
          User,
          Post,
          Admin,
          Photos,
          Preferance,
          Profile,
          UserAvatar,
          ForgetPassword,
          Family,
          EducationEntity,
          Connection,
          ConnectionRequest,
          Message,
          MessageAttachment,
          Conversation,
          Peer,
          Notification,
          Call,
          Banner,
          EmailVerification,
          // __dirname + '/../**/*.entity.ts'
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
