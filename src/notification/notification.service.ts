import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Notification from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationParams } from 'src/utils/types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(params: CreateNotificationParams) {
    const { user, heading, content, type } = params;
    const newNotification = this.notificationRepository.create(params);
    return await this.notificationRepository.save(newNotification);
  }

  async delete(userId: string, notificationId: string) {
    const targetNotification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user: { id: userId },
      },
    });
    if (!targetNotification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }
  }

  async getById(notificationId: string) {
    return await this.notificationRepository.findOne({
      where: { id: notificationId },
    });
  }
}
