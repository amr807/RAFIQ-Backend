import { Module } from '@nestjs/common';
import { EmployeedbliveTrackService } from './employeedblive-track.service';
import { EmployeedbliveTrackController } from './employeedblive-track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemcachedModule } from '@andreafspeziale/nestjs-memcached';

@Module({
  imports:[MemcachedModule.forRoot({
    connections: [
      {
        host: process.env.MEMCACHED_HOST ,
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
  })],
  controllers: [EmployeedbliveTrackController],
  providers: [EmployeedbliveTrackService],
})
export class EmployeedbliveTrackModule {}
