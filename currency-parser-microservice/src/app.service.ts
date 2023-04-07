import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {Cexio} from 'node-crypto-api';
import { RedisClientService } from './redis-client/redis-client.service';
import { globalVariables } from './utils/global-variables';

@Injectable()
export class AppService {
  constructor(private readonly redisClientService: RedisClientService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    try {
      const cexio = new Cexio();
      for (let currency of globalVariables.currencies) {
        const res = await cexio.ticker(currency, globalVariables.baseCurrency);
        await this.redisClientService.set(res.pair, res.ask);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
