import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtSimpleGuard implements CanActivate {
constructor(private Service: JwtService,private configService: ConfigService){}
  canActivate(context: ExecutionContext): boolean {
    
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
  const token =
      client.handshake?.auth?.token ||
      data?.access_token ||client.handshake.query.access_token||
      client.handshake?.headers?.authorization?.replace('Bearer ', '');

    if (!token) return false;


      try {

        const secret = this.configService.get<string>('JWT_PASS_SECRET');
  const payload = this.Service.verify(token, {secret:secret} );
  client.data.user = payload;
  return true;
} catch (err) {
  console.error('[JWT VERIFY ERROR]', err.name, err.message);
  throw new WsException('Invalid or expired token');
}
  }
}
