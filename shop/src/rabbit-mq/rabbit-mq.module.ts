import { Module } from "@nestjs/common";

import { config } from 'dotenv';
import { ClientsModule, Transport } from "@nestjs/microservices";
config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE', transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL],
          queue: 'user-messages',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {
}