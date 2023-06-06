import { Test, TestingModule } from '@nestjs/testing';
import { PeerController } from './peer.controller';

describe('PeerController', () => {
  let controller: PeerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeerController],
    }).compile();

    controller = module.get<PeerController>(PeerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
