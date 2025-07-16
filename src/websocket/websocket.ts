import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MemcachedService } from '@andreafspeziale/nestjs-memcached';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from 'src/modules/manager';
import { CreateTrackingDto } from 'src/tracking/dto/create-tracking.dto';
import { getConnections, DbConnections } from 'src/helper_connection.helper';

@Injectable() 
@WebSocketGateway({ cors: { origin: "*" } }) 
export class MyGateway implements OnModuleInit {
  constructor(
    @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private AuthRepo: Repository<Auth>,
    @Inject(MemcachedService) private readonly memcachedReoo: MemcachedService
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      socket.emit('Welcome', { msg: 'Connected to WebSocket server' });
    });
  }
  @SubscribeMessage('email')

  async handleSetup(@MessageBody() payload ,@ConnectedSocket() client: Socket
) {
   
    client.join(payload.id);

  }



  @SubscribeMessage('Message')
  async handleMessage(@MessageBody() payload: { email: string }) {
    try {
      const userId = (await this.findOne(payload.email, this.AuthRepo))?.id;
      if (!userId) {
        this.server.emit('Message', { msg: 'User not found' });
        return;
      }
      const key = `manager_${userId}`;
      const cachedData = await this.memcachedReoo.get(key);

      this.server.emit('Message', {
        msg: 'Data retrieved',
        data: cachedData,
      });
    } catch (error) {
      console.error('Error:', error);
      this.server.emit('error', { msg: 'Failed to process request' });
    }
  }

  async findOne(email: string, Repository: Repository<Auth>) {
    return await Repository.findOneBy({ email });
  }

  sendLocationUpdate(managerId: string, data: any) {
    this.server.emit(`location_update_${managerId}`, data);
    console.log(`Emitting location update for manager ${managerId}:`, data);
  }
}
