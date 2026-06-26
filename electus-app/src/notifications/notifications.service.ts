import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async findAllForUser(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update({ userId, isRead: false }, { isRead: true });
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const result = await this.notificationsRepository.update(
      { id: notificationId, userId },
      { isRead: true },
    );
    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  // Helper method to create a notification (e.g. called by other services)
  async createNotification(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationsRepository.create(data);
    return this.notificationsRepository.save(notification);
  }
}
