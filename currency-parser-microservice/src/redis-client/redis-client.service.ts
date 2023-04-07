import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {
  private client;

  async onModuleInit() {
    this.client = createClient();
    await this.client.connect();
  }

  async set(key: string, value: any) {
    return await this.client.set(key, value);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
