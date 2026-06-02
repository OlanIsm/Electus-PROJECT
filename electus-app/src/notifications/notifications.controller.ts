import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Req() req) {
    return this.notificationsService.findAllForUser(req.user.userId);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req) {
    await this.notificationsService.markAllAsRead(req.user.userId);
    return { success: true, message: 'All notifications marked as read.' };
  }

  @Patch(':id/read')
  async markAsRead(@Req() req, @Param('id') id: string) {
    await this.notificationsService.markAsRead(req.user.userId, id);
    return { success: true, message: 'Notification marked as read.' };
  }
}
