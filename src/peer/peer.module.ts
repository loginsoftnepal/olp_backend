import { Module } from '@nestjs/common';
import { PeerController } from './peer.controller';

@Module({
  controllers: [PeerController],
})
export class PeerModule {}
