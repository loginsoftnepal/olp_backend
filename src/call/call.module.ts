import { Module } from '@nestjs/common';
import { CallController } from './call.controller';
import { CallService } from './call.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './call.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Call])],
  controllers: [CallController],
  providers: [CallService],
  exports: [CallService],
})
export class CallModule {}
