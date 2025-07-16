import { Controller, Get, Request ,Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmployeetaskService } from 'src/employeetask/employeetask.service';

@Controller()
export class TasksController {
  constructor(private configService:ConfigService,private jwtService: JwtService, private readonly tasksService: TasksService ){}

 @UseGuards(AuthGuard('jwt'))
  @Get('employeetask')
  create(@Request() req) {

  const user = req.user; 
    console.log('Authenticated :', user.Id);

return this.tasksService.create(user);
  }


}
