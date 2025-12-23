import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  // Recebe notificação e envia para o usuário via room
  sendNotification(notification: Notification) {
    this.notificationsService.addNotification(notification);
    this.server.to(notification.userId).emit('notification', notification);
  }

  // Clientes chamam "register" ao conectar para entrar na room
  @SubscribeMessage('register')
  handleRegister(@MessageBody() userId: string, client: any) {
    client.join(userId); // room por userId
  }
}
