import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { ConfigModule } from '@nestjs/config';
import { MemcachedModule } from '@andreafspeziale/nestjs-memcached';
import { MyGateway } from 'src/websocket/websocket';
import { Auth } from 'src/modules/manager';
import { RabbitMQProducerService } from 'src/queueWorker/rabbitmq.producer';
import { RabbitMQConsumerService } from 'src/queueWorker/rabbitmq.controller';
import { RabbitModule } from 'src/queueWorker/rabbit.module';

@Module({
  imports: [RabbitModule, MemcachedModule.forRoot({
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
        }),
    process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Employee_db,Auth])
  : TypeOrmModule.forFeature([Employee_db,Auth],'auth_db')


    ],
  controllers: [TrackingController],
  providers: [
    TrackingService, MyGateway],
})
export class TrackingModule {}
