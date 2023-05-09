import { Module } from '@nestjs/common';
import { UserAvatarService } from './user-avatar.service';
import UserAvatarController from './user-avatar.controller';
import UserAvatar from './user-avatar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserAvatar])],
  providers: [UserAvatarService],
  controllers: [UserAvatarController],
  exports: [UserAvatarService],
})
export class UserAvatarModule {}
