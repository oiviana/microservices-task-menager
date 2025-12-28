import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import * as amqp from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';
import { Notification } from './entities/notification.entity';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);

  private channelModel: ChannelModel | null = null;
  private channel: Channel | null = null;

  private readonly queueName = 'notifications';
  private readonly rabbitUrl =
    process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

  constructor(
    private readonly notificationsGateway: NotificationsGateway,
  ) { }

  async onModuleInit() {
    this.start();
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }

    if (this.channelModel) {
      await this.channelModel.close();
    }
  }

  private async start() {
    while (true) {
      try {
        await this.connect();
        await this.consume();
        break;
      } catch (err) {
        this.logger.warn(
          'RabbitMQ indisponível, tentando novamente em 5s...',
        );
        await this.delay(5000);
      }
    }
  }

  private async connect() {
    this.logger.log('Conectando ao RabbitMQ...');

    this.channelModel = await amqp.connect(this.rabbitUrl);
    this.channel = await this.channelModel.createChannel();

    await this.channel.assertQueue(this.queueName, { durable: true });

    this.logger.log('Conectado ao RabbitMQ com sucesso');
  }

  private async consume() {
    if (!this.channel) return;

    this.logger.log(`Consumindo fila "${this.queueName}"`);

    this.channel.consume(this.queueName, msg => {
      if (!msg) return;

      try {
        const notification: Notification = JSON.parse(
          msg.content.toString(),
        );

        this.notificationsGateway.sendNotification(notification);
        this.channel!.ack(msg);
      } catch (err) {
        this.logger.error('Erro ao processar mensagem', err);
        this.channel!.nack(msg, false, false);
      }
    });
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

