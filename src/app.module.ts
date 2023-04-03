import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from 'typeorm';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";

import { RolesGuard } from "./auth/roles/roles.guard";

import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";
import { ImagesModule } from "./images/images.module";
import { CategoriesModule } from "./categories/categories.module";
import { RatingsModule } from "./ratings/ratings.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      autoLoadEntities: true,
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    ImagesModule,
    CategoriesModule,
    RatingsModule
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
  constructor(private dataSource: DataSource) {}
}
