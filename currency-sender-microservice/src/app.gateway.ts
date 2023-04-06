import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Cron, CronExpression } from '@nestjs/schedule';
import { globalVariables } from './utils/global-variables';
import { RedisClientService } from './redis-client/redis-client.service';

@WebSocketGateway(3080, {
  namespace: '/api/get_currencies',
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly redisClientService: RedisClientService) {}
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('AppGateway');

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    let response = [];
    for (let currency of globalVariables.currencies) {
      const currenciesPair = `${currency}:${globalVariables.baseCurrency}`;
      const rate = await this.redisClientService.get(currenciesPair);
      const obj = {};
      obj[currenciesPair] = rate;
      response.push(obj);
    }
    this.server.emit('msgToClient', response);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
