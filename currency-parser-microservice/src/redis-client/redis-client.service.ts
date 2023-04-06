import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {
  private client;

  async onModuleInit() {
    this.client = createClient();
    await this.client.connect();
  }

  async set(key: string, value: any, ttl: number) {
    return await this.client.set(key, value, { EX: ttl });
  }

  async get(key) {
    try {
        return await this.client.get(key);
    } catch (e) {
        throw e
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
