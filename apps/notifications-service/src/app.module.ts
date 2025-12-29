import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@repo/logger';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { NotificationsListener } from './notifications/notifications.listener';

@Module({
  imports: [AppLoggerModule],
  providers: [NotificationsService, NotificationsGateway, NotificationsListener],
})
export class AppModule {}
