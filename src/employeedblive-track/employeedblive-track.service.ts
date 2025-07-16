import { Inject, Injectable } from '@nestjs/common';
import { CreateEmployeedbliveTrackDto } from './dto/create-employeedblive-track.dto';
import { UpdateEmployeedbliveTrackDto } from './dto/update-employeedblive-track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MemcachedService } from '@andreafspeziale/nestjs-memcached';

@Injectable()
export class EmployeedbliveTrackService {
  constructor(
    @Inject(MemcachedService) private readonly memcachedReoo:MemcachedService,
  ) {}
  create(createEmployeedbliveTrackDto: CreateEmployeedbliveTrackDto) {
    console.log('createEmployeedbliveTrackDto', createEmployeedbliveTrackDto);
   
    const key = `manager_${createEmployeedbliveTrackDto.manager_id}`;
   return this.memcachedReoo.get(key)
  }

 
}
