import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  findall_db_names(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.findall_db_names(createEmployeeDto);
  }
@Put()
 update(@Body() createAdminDto: UpdateEmployeeDto) {
    return this.employeesService.update(createAdminDto);

  }

 
}
