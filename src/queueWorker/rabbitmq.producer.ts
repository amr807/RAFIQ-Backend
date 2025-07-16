import { Injectable, Inject } from '@nestjs/common';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQProducerService {
  constructor(
    @Inject('RABBITMQ_SERVICE')  readonly client: ClientProxy,
  ) {}

async  sendToQueue(pattern: string, data: any) {
    try {
    console.log('Sending to RabbitMQ queue:', pattern, data);
this.client.connect();
    this.client.emit(pattern,data);
    }catch (error) {
      console.error('Error sending to RabbitMQ:', error);
      throw error;
    }
}
}
