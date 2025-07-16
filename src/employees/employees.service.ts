import {  Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee_db } from 'src/modules/employee';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from 'src/modules/manager';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { findIdByEmail } from 'src/db_fuction/find_id';
import { DbConnections, getConnections } from 'src/helper_connection.helper';

@Injectable()
export class EmployeesService {
  constructor(   @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private readonly authRepository: Repository<Auth>,
  @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private readonly employeeRepository: Repository<Employee_db>){}
  async findall_db_names(createEmployeeDto: CreateEmployeeDto) {
    const {email}=createEmployeeDto
   
const manager_id=await findIdByEmail(email,this.authRepository) as string;

const employee_names = await this.employeeRepository.find({
  where: { manager: manager_id },
  select: ['user_id', 'manager','firstname','lastname','Isfirstlogin','createdAt', 'email', 'phone', 'vehicle'], 
});
return employee_names;
  
}
 async update( updateAdminDto: UpdateEmployeeDto) {
  const id=   await findIdByEmail(updateAdminDto.email,this.employeeRepository) 
const phone=`(${updateAdminDto.country_code})${updateAdminDto.phone}`
const vehicle=  updateAdminDto.vehicle;
await this.employeeRepository.update(id, {
  Isfirstlogin: false,
  phone: phone,
  vehicle: vehicle,
});
return 
  }



 
}
