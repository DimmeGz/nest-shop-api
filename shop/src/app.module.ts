import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";

import { RolesGuard } from "./auth/guards/roles.guard";

import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";
import { ImagesModule } from "./images/images.module";
import { CategoriesModule } from "./categories/categories.module";
import { RatingsModule } from "./ratings/ratings.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { CommentsModule } from "./comments/comments.module";
import { config } from 'dotenv';
import { RabbitMQModule } from "./rabbit-mq/rabbit-mq.module";
config();


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    RabbitMQModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    ImagesModule,
    CommentsModule,
    CategoriesModule,
    RatingsModule,
    SuppliersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {
}
