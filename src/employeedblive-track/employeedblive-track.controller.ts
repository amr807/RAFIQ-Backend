import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeedbliveTrackService } from './employeedblive-track.service';
import { CreateEmployeedbliveTrackDto } from './dto/create-employeedblive-track.dto';
import { UpdateEmployeedbliveTrackDto } from './dto/update-employeedblive-track.dto';

@Controller('employeedblive-track')
export class EmployeedbliveTrackController {
  constructor(private readonly employeedbliveTrackService: EmployeedbliveTrackService) {}

  @Post()
  create(@Body() createEmployeedbliveTrackDto: CreateEmployeedbliveTrackDto) {
    return this.employeedbliveTrackService.create(createEmployeedbliveTrackDto);
  }


}
