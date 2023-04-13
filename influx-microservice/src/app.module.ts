import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { RedisClientModule } from './redis-client/redis-client.module';

@Module({
  imports: [RedisClientModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
