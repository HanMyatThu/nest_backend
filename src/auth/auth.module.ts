import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { localStrategy } from './strategies/local.strategies';
import { LoginValidationMiddleware } from './middleware/login-validation/login-validation.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    localStrategy, 
  ],
  exports: [HashingService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('auth/login');
  }
}
