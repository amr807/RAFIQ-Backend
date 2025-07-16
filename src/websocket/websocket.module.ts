import { Module } from '@nestjs/common';
import { MyGateway } from './websocket';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';
import { MemcachedModule } from '@andreafspeziale/nestjs-memcached';
@Module({
  imports:[ MemcachedModule.forRoot({
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
          }),process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Auth])
  : TypeOrmModule.forFeature([Auth], 'auth_db')

],
  providers: [MyGateway],
  exports:[MyGateway]
})
export class WebSocketModule {}
