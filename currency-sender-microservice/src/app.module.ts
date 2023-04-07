import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppGateway } from './app.gateway';
import { RedisClientModule } from './redis-client/redis-client.module';

@Module({
  imports: [RedisClientModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
