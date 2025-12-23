import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COMMENTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://admin:admin@rabbitmq:5672'],
          queue: 'comments_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
