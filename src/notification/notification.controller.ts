import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getNotifications(@Req() request: RequestWithUser) {
    return await this.notificationService.getNotificationOfUser(
      request.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deleteNotification(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ) {
    console.log(id);
    return await this.notificationService.delete(request.user.id, id);
  }
}
