import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { CustomLogger } from '@repo/logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL!],
        queue: 'notifications_queue',
        queueOptions: {
          durable: true,
        },
        retryAttempts: 10,
        retryDelay: 3000,
      },
      bufferLogs: true,
    },
  );

  // Recupera o CustomLogger do container de DI e registra como logger oficial da aplicação
  app.useLogger(app.get(CustomLogger));

  await app.listen();
}
bootstrap();
