import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BasicStrategy } from './basic.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtGuard } from './jwt.guard';
import { config } from './configuration';
import { SchemasModule } from '../schemas/schemas.module';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.expiration')
        }
      }),
      inject: [ConfigService]
    }),
    SchemasModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
    AuthService,
    BasicStrategy,
    JwtStrategy
  ]
})
export class AuthModule {}
