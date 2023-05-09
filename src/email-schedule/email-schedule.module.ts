import { Module } from '@nestjs/common';
import { EmailScheduleService } from './email-schedule.service';
import { EmailModule } from 'src/email/email.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [EmailModule, ScheduleModule],
  providers: [EmailScheduleService],
  exports: [EmailScheduleService],
})
export class EmailScheduleModule {}
