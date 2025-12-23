import { Injectable, Logger } from '@nestjs/common';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Persistência temporária em memória
  private notifications: Notification[] = [];

  addNotification(notification: Notification) {
    this.notifications.push(notification);
    this.logger.log(`Nova notificação adicionada: ${notification.message}`);
  }

  getUserNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }
}
