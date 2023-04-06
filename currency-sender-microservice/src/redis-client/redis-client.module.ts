import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { RedisClientService } from './redis-client.service';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
