import { Module } from '@nestjs/common';
import { NotifactionGateway } from './notifaction.gateway';
import { AuthModule } from 'src/jwt/jwt.module';

@Module({
  imports:[AuthModule],
  providers: [NotifactionGateway],
  exports: [NotifactionGateway],
})
export class NotifactionModule {}
