import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-EmployeeCompleteprofile.dto';
import { UpdateAdminDto } from './dto/update-EmployeeCompleteprofile.dto';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

@Put()
  update(@Body() createAdminDto: UpdateAdminDto) {
    console.log(createAdminDto.email)
    return this.adminService.update(createAdminDto);

  }
 


}
