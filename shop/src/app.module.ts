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
