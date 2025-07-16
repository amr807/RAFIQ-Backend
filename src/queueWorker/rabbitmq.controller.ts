import { Controller, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Client, ClientProxy, EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { CreateTrackingDto } from '../tracking/dto/create-tracking.dto';
import { MemcachedService } from '@andreafspeziale/nestjs-memcached';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { MyGateway } from 'src/websocket/websocket';
import { Repository } from 'typeorm';
import { RabbitMQService } from './rabbit.service';

@Controller()
export class RabbitMQConsumerService  {
  private readonly logger = new Logger(RabbitMQConsumerService .name);

  constructor(
    private readonly rabbitservice:RabbitMQService
  ) {
    console.log('RabbitMQConsumerService instantiated');

  }

@EventPattern(process.env.RABBITMQ_NAME)
  async handleTracking(@Payload() data: any) {
    this.logger.log('Received tracking data:.................................');
    await this.rabbitservice.processTrackingUpdate(data.progress, data);
  }



}