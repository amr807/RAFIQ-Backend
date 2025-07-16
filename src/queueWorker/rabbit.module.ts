
import { forwardRef, Module } from '@nestjs/common';
import { RabbitMQConsumerService } from './rabbitmq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemcachedModule, MemcachedService } from '@andreafspeziale/nestjs-memcached';
import { Employee_db } from 'src/modules/employee';
import { MyGateway } from 'src/websocket/websocket';
import { Auth } from 'src/modules/manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQProducerService } from './rabbitmq.producer';
import { TrackingModule } from 'src/tracking/tracking.module';
import { RabbitMQService } from './rabbit.service';

@Module({
  imports:[       ClientsModule.register([
    {
      name: 'RABBITMQ_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'task_tracking_queue',
        queueOptions: { durable: true },
      },
    },
  ]),MemcachedModule.forRoot({
            connections: [
              {
                host: '127.0.0.1',
                port: 11212,
              },
            ],
            ttl: 0,
            ttr: 30,
            superjson: true,
            keyProcessor: (key) => `prefix_${key}`,
            wrapperProcessor: ({ value, ttl, ttr }) => ({
              content: value,
              ttl,
              ...(ttr ? { ttr } : {}),
              createdAt: new Date(),
            }),
            log: true,
          })
      ,
      
      process.env.MODE == 'prod'
  ?  TypeOrmModule.forFeature([Employee_db,Auth])
  :  TypeOrmModule.forFeature([Employee_db,Auth],'auth_db')

      
     ] 
      ,controllers: [RabbitMQConsumerService],
providers:[MyGateway,RabbitMQProducerService,RabbitMQService],
exports: [RabbitMQProducerService], 
})
export class RabbitModule {}
