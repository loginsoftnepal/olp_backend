import { Test, TestingModule } from '@nestjs/testing';
import UserAvatarController from './user-avatar.controller';

describe('UserAvatarController', () => {
  let controller: UserAvatarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAvatarController],
    }).compile();

    controller = module.get<UserAvatarController>(UserAvatarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
