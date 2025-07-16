import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { RabbitMQProducerService } from 'src/queueWorker/rabbitmq.producer';

@Controller()
export class TrackingController {
 
  constructor(private readonly trackingService: TrackingService,
    private readonly rabbitMQService: RabbitMQProducerService,
  ) {}

 
  @Post('tracking')
  async create(@Body() createTrackingDto: CreateTrackingDto) {
    try {
      this.rabbitMQService.sendToQueue('task_tracking_queue', createTrackingDto);

  
      return { message: 'Tracking data sent successfully!' };
    } catch (error) {
      throw error;
    }

   
  }


@Post('trackingID')
get(@Body() createTrackingDto: CreateTrackingDto) {
  return this.trackingService.get(createTrackingDto);
  }
}
