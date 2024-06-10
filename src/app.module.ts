import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { OrderModule } from './domain/order/order.module';

@Module({
  imports: [UsersModule, CommonModule, DatabaseModule, EnvModule, OrderModule],
})
export class AppModule {}
