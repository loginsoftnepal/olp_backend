import { Test, TestingModule } from '@nestjs/testing';
import { SocketwayService } from './socketway.service';

describe('SocketwayService', () => {
  let service: SocketwayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketwayService],
    }).compile();

    service = module.get<SocketwayService>(SocketwayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
