import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';
import EmailScheduleDto from './dto/emailSchedule.dto';
import { CronJob } from 'cron';

@Injectable()
export class EmailScheduleService {
  constructor(
    private readonly emailService: EmailService,
    private readonly scheduleRegistry: SchedulerRegistry,
  ) {}

  scheduleEmail(emailSchedule: EmailScheduleDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      this.emailService.sendMail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content,
      });
    });

    this.scheduleRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );
    job.start();
  }
}
