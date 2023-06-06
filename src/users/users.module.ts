import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import User from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAvatarModule } from 'src/user-avatar/user-avatar.module';
import { ConfigModule } from '@nestjs/config';
import { ForgetPasswordModule } from 'src/forget-password/forget-password.module';
import { EmailScheduleModule } from 'src/email-schedule/email-schedule.module';
import { ProfileModule } from 'src/profile/profile.module';
import { FamilyModule } from 'src/family/family.module';
import { EducationService } from 'src/education/education.service';
import { PreferanceService } from 'src/preferance/preferance.service';
import { EducationModule } from 'src/education/education.module';
import { PreferanceModule } from 'src/preferance/preferance.module';
import { PeerModule } from 'src/peer/peer.module';
import { Peer } from 'src/peer/peer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Peer]),
    UserAvatarModule,
    ConfigModule,
    ForgetPasswordModule,
    EmailScheduleModule,
    ProfileModule,
    FamilyModule,
    EducationModule,
    PreferanceModule,
    PeerModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
