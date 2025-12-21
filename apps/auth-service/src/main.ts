import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

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
      },
    },
  );

  // ValidationPipe para DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serialização global (aplica @Exclude)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen();
}

bootstrap();
