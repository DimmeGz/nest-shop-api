import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";

import { RolesGuard } from "./auth/roles/roles.guard";

import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";

import { User } from "./users/user.entity";
import { Product } from "./products/product.entity";
import { Order } from "./orders/entities/order.entity";
import { OrdersModule } from "./orders/orders.module";
import { OrderRow } from "./orders/entities/order-row.entity";
import { Category } from "./categories/category.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [
        User,
        Category,
        Product,
        Order,
        OrderRow,
      ],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
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
