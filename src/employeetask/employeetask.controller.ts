import { Controller,Request, Get,Headers, Post, Body, Patch, Param, Delete, UnauthorizedException, UseGuards, Put } from '@nestjs/common';
import { EmployeetaskService } from './employeetask.service';
import { CreateEmployeetaskDto } from './dto/create-employeetask.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { CompleteTask } from './dto/update-employeetask.dto';

@Controller()
export class EmployeetaskController {
  constructor(private configService:ConfigService,private jwtService: JwtService,private readonly employeetaskService: EmployeetaskService) {}
 
@Post('employee_task') 
get(@Body() createEmployeetaskDto: CreateEmployeetaskDto) {
  console.log("createEmployeetaskDto",createEmployeetaskDto)
  return this.employeetaskService.get(createEmployeetaskDto);

}

@Put("completed_task")
complete(@Body() createEmployeetaskDto: CompleteTask) {
  console.log("createEmployeetaskDto",createEmployeetaskDto)
return this.employeetaskService.Complete_task(createEmployeetaskDto)
}
@Put("update_task_status")
Uptdate(@Body() createEmployeetaskDto: CompleteTask) {
  console.log("createEmployeetaskDto",createEmployeetaskDto)
return this.employeetaskService.Uptdate(createEmployeetaskDto)
}








}
