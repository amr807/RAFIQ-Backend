import { Controller, Get, Post, Body, Patch, Param, Delete, Put, BadRequestException } from '@nestjs/common';
import { CreateManagernotificationDto } from './dto/create-managernotification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagerNotification } from 'src/modules/manager_notication';
import { findIdByEmail } from 'src/db_fuction/find_id';
import { UpdateManagernotificationDto } from './dto/update-managernotification.dto';
import { Auth } from 'src/modules/manager';
import { Employee_db } from 'src/modules/employee';
import { EmployeeNotification } from 'src/modules/employee_notication';

@Controller()
export class ManagernotificationsController {
  constructor(
    @InjectRepository(Auth,'auth_db')
    private  AuthRepo: Repository<Auth>,
    @InjectRepository(Employee_db,'auth_db')
    private  EmployeeRepo: Repository<Employee_db>,
@InjectRepository(ManagerNotification, 'notification')
    private readonly managernotificationsService: 
   Repository< ManagerNotification>,
@InjectRepository(EmployeeNotification, 'notification')
    private readonly EmployeenotificationsService: 
   Repository< EmployeeNotification>,
  ) {}

  @Post('managernotifications')
  async create(@Body() createManagernotificationDto: CreateManagernotificationDto) {
    const id=await findIdByEmail(createManagernotificationDto.email,this.AuthRepo)
return await this.managernotificationsService.find({where:{recipient_id:String(id)}})


}
  @Post('Employeenotifications')
  async get_employee(@Body() createManagernotificationDto: CreateManagernotificationDto) {
    const id=await findIdByEmail(createManagernotificationDto.email,this.EmployeeRepo)
return await this.EmployeenotificationsService.find({where:{recipient_id:String(id)}})


}
@Put('id')
  async updatereadableofmessage( @Body() createManagernotificationDto: UpdateManagernotificationDto) {

    return await this.managernotificationsService.update(createManagernotificationDto.id,{is_read:true})
  }
@Put('Employeenotifications_id')
  async updatereadableofmessage_employee( @Body() createManagernotificationDto: UpdateManagernotificationDto) {
console.log(createManagernotificationDto)
    return await this.EmployeenotificationsService.update(createManagernotificationDto.id,{is_read:true})
  }

@Put("all")
  async updatereadableofallmessage(@Body() createManagernotificationDto: UpdateManagernotificationDto) {
    console.log(createManagernotificationDto.id)
    const ids = createManagernotificationDto.id; // assume this is an array

    if (Array.isArray(ids)) {
      await Promise.all(
        ids.map(id => this.managernotificationsService.update(id, { is_read: true })),
      );
      return { message: 'All notifications marked as read' };
    } else {
      throw new BadRequestException('bad format ');
    }
  }
    

@Put("Employeenotifications_all")
  async updatereadableofallmessage_employee(@Body() createManagernotificationDto: UpdateManagernotificationDto) {
    console.log(createManagernotificationDto.id)
    const ids = createManagernotificationDto.id; // assume this is an array

    if (Array.isArray(ids)) {
      await Promise.all(
        ids.map(id => this.EmployeenotificationsService.update(id, { is_read: true })),
      );
      return { message: 'All notifications marked as read' };
    } else {
      throw new BadRequestException('bad format ');
    }
  }
    

}