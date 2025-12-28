import { NotificationEvent } from '@/tasks/types/notification-event.interface';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQPublisher implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQPublisher.name);
  private channel: amqp.Channel;

async onModuleInit() {
  const rabbitUrl =
    process.env.RABBITMQ_URL ?? 'amqp://localhost';

  const connection = await amqp.connect(rabbitUrl);
  this.channel = await connection.createChannel();
  await this.channel.assertQueue('notifications', { durable: true });

  this.logger.log('RabbitMQ Publisher conectado');
}


  async publish<TPayload>(
    event: NotificationEvent<TPayload>,
  ): Promise<void> {
    this.channel.sendToQueue(
      'notifications',
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );
  }
}
