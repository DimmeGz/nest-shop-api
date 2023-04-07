import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {
  private client;

  async onModuleInit() {
    this.client = createClient();
    await this.client.connect();
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (e) {
      throw e;
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
