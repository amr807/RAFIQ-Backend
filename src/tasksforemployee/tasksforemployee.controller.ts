import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TasksforemployeeService } from './tasksforemployee.service';
import { CreateTasksforemployeeDto } from './dto/create-tasksforemployee.dto';
import { UpdateTasksforemployeeDto } from './dto/update-tasksforemployee.dto';

@Controller('tasksforemployee')
export class TasksforemployeeController {
  constructor(private readonly tasksforemployeeService: TasksforemployeeService) {}

  @Post()
  create(@Body() createTasksforemployeeDto: CreateTasksforemployeeDto) {
    return this.tasksforemployeeService.create(createTasksforemployeeDto);
  }
@Put()
uptdate(@Body() updateTasksforemployeeDto:UpdateTasksforemployeeDto)
  {
    return this.tasksforemployeeService.update(updateTasksforemployeeDto)
  }
}
