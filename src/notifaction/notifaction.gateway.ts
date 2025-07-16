import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, WsException, OnGatewayConnection } from '@nestjs/websockets';
import { CreateNotifactionDto } from './dto/create-notifaction.dto';
import { Server, Socket } from 'socket.io';
import { WsJwtSimpleGuard } from './websocketseuirty.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway( {namespace: '/notifications' , cors: { origin: '*' } })
export class NotifactionGateway  implements OnGatewayConnection {
 constructor(private Service: JwtService,private configService: ConfigService){}
 

@WebSocketServer() server: Server; 
  wsJwtAuthGuard:WsJwtSimpleGuard;
  async handleConnection(socket: Socket) {
  const token = socket.handshake.query.access_token as string;
  if (!token) {
    console.log('No token provided');
socket.disconnect()
    return;
  }
 try {
        const secret = this.configService.get<string>('JWT_PASS_SECRET');
  const payload = this.Service.verify(token, {secret:secret} );
    socket.data.user = payload; 
    console.log('User connected:', socket.id);
    socket.emit('Welcome_notification', { msg: 'Welcome!' });
  
      const user_id = payload.sub;
    console.log('[Gateway] User:', payload);

    if (!user_id) {
      throw new WsException('User data missing');
    }
      socket.join(user_id); 

  console.log(`Socket ${socket.id} joined room`);
  
  } catch (e) {
    console.log('Invalid token:', e.message);
           socket.emit('unauthorized', { msg: 'Unauthorized: Invalid token' });

    socket.disconnect();
  }
  
  } 

@SubscribeMessage('join_employee_room')

handleJoin( @ConnectedSocket() client: Socket) {
    const user_id = client.data?.user.sub;
    console.log('[Gateway] User:', user_id);

    if (!user_id) {
      throw new WsException('User data missing');
    }
      client.join(user_id); 

  console.log(`Socket ${client.id} joined room`);
}

notifincationemployee( createNotifactionDto: CreateNotifactionDto) {
    console.log('createNotifaction', createNotifactionDto);

    this.server.to(createNotifactionDto.id).emit("get_all_notification", createNotifactionDto.notification); 
    
  }
  notifincationmanager( createNotifactionDto: CreateNotifactionDto) {
    console.log('createNotifaction', createNotifactionDto);

    this.server.to(createNotifactionDto.id).emit("get_all_notification", createNotifactionDto.notification); 
    
  }

  @SubscribeMessage('findAllNotifaction')
welcome(@MessageBody() data: any) {
    console.log('findAllNotifaction', data);
        this.server.to('84222062-2dab-4731-a8e0-f81fad3609ff').emit('huujjj', { msg: `Connected to WebSocket server=>notication` });
  }
}


