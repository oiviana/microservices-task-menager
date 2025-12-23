import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import * as amqp from 'amqplib';
import { Notification } from './entities/notification.entity';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly queueName = 'notifications';

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  async onModuleInit() {
    await this.connectAndConsume();
  }

  private async connectAndConsume() {
    try {
      const connection = await amqp.connect('amqp://localhost'); // URL do RabbitMQ
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      this.logger.log(`Consumindo fila ${this.queueName}...`);

      channel.consume(this.queueName, msg => {
        if (msg) {
          try {
            const notification: Notification = JSON.parse(msg.content.toString());

            this.logger.log(`Mensagem recebida do RabbitMQ: ${notification.message}`);

            // Envia via WS e persiste
            this.notificationsGateway.sendNotification(notification);

            channel.ack(msg);
          } catch (err) {
            this.logger.error('Erro ao processar mensagem do RabbitMQ', err);
            channel.nack(msg, false, false); // descarta mensagem
          }
        }
      });
    } catch (err) {
      this.logger.error('Erro ao conectar no RabbitMQ', err);
    }
  }
}
