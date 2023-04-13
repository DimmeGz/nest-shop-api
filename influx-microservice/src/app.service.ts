import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { RedisClientService } from './redis-client/redis-client.service';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';
config();

@Injectable()
export class AppService {
  constructor(private readonly redisClientService: RedisClientService) { }

  @Cron(process.env.CRON_TIME)
  async influx() {
    const client = new InfluxDB({
      url: process.env.INFLUXDB_URL,
      token: process.env.INFLUXDB_TOKEN,
    })

    const writeClient = client.getWriteApi(
      process.env.INFLUXDB_ORG,
      process.env.INFLUXDB_BUCKET,
      'ns'
    )

    for await (let currency of process.env.CURRENCIES.split(',')) {
      const currenciesPair = `${currency}:${process.env.BASECURRENCY}`;
      const rate = await this.redisClientService.get(currenciesPair);

      const point = new Point('currencies_rate')
        .tag('currenciesPair', currenciesPair)
        .floatField('rate', rate)

      await writeClient.writePoint(point)
      await writeClient.flush()
    }
  }
}
