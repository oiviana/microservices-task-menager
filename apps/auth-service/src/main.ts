import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { CustomLogger } from '@/logger/custom-logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL!],
        queue: 'auth_queue',
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

  // ValidationPipe para DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serialização global
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen();
}

bootstrap();
