import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL],
      queue: 'user-messages',
      queueOptions: {
        durable: false
      },
    },
  });
  await app.listen();
}
bootstrap();
