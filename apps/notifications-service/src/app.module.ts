import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { RabbitMQService } from './notifications/rabbitmq.service';

@Module({
  providers: [NotificationsService, NotificationsGateway, RabbitMQService],
})
export class AppModule {}
