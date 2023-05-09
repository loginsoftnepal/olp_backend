import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import User from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAvatarModule } from 'src/user-avatar/user-avatar.module';
import { ConfigModule } from '@nestjs/config';
import { ForgetPasswordModule } from 'src/forget-password/forget-password.module';
import { EmailScheduleModule } from 'src/email-schedule/email-schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserAvatarModule,
    ConfigModule,
    ForgetPasswordModule,
    EmailScheduleModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
