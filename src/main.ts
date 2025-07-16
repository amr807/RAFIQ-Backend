import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventEmitter } from 'events';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  EventEmitter.defaultMaxListeners = Number(process.env.MAX_LISTENERS) ;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ],
      queue:process.env.RABBITMQ_NAME,
      queueOptions: {
        durable: true,
      },
    },
  });
    app.use(cookieParser()); 

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
