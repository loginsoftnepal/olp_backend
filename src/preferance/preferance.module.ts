import { Module } from '@nestjs/common';
import { PreferanceService } from './preferance.service';
import { PreferanceController } from './preferance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Preferance from './preferance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Preferance])],
  providers: [PreferanceService],
  controllers: [PreferanceController],
})
export class PreferanceModule {}
