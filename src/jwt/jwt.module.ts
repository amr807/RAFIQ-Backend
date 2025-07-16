import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import {  JwtStrategy } from './jwt.service';
import { JwtController } from './jwt.controller';
import { JwtRefreshStrategy } from './jwtphone.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-refresh' }),
    ConfigModule,
  ],
  controllers:[JwtController],
  providers: [JwtStrategy,JwtRefreshStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
