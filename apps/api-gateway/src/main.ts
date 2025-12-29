import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLogger } from '@repo/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Recupera o CustomLogger do container de DI e registra como logger oficial da aplicação
  app.useLogger(app.get(CustomLogger));

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:3000', // front rodando fora do docker
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Microservices Gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
