import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTasksforemployeeDto } from './dto/create-tasksforemployee.dto';
import { UpdateTasksforemployeeDto } from './dto/update-tasksforemployee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';
import { Task_DB } from 'src/modules/task_db';
import { Repository } from 'typeorm';
import { findIdByEmail } from 'src/db_fuction/find_id';
import { findTasksById } from 'src/db_fuction/find_tasks';
import { findTaskById } from 'src/db_fuction/find_task';
import { DbConnections, getConnections } from 'src/helper_connection.helper';

@Injectable()
export class TasksforemployeeService {
  constructor(    @InjectRepository(Task_DB,getConnections(DbConnections.TASK)) private Taskrespository: Repository<Task_DB>,
      @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeReposirty: Repository<Employee_db>,


  ){}
  async create(createTasksforemployeeDto: CreateTasksforemployeeDto) {
    this.validateEmail(createTasksforemployeeDto);
    const user_id=await findIdByEmail(createTasksforemployeeDto.email,this.EmployeeReposirty)
    const id=await this.findMangerID(user_id,this.EmployeeReposirty)
    const task = await findTasksById(id,this.Taskrespository,user_id);
 return task;
  }

private validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.email)) {
    throw new BadRequestException('Invalid email format');
  }

}
async update(updateTasksforemployeeDto: UpdateTasksforemployeeDto){
if(updateTasksforemployeeDto.task_id==null || updateTasksforemployeeDto.status==null){

  throw new BadRequestException("payload is not correct")
}


await this.Taskrespository.update({ id: updateTasksforemployeeDto.task_id }, { status: updateTasksforemployeeDto.status });

}

  async findMangerID(id,Repository: Repository<Employee_db>) {
    const Manage_id= await (await Repository.findOneBy({user_id:id})).manager
if(Manage_id==null){
  throw new Error("cerdential is not correct")}
    return Manage_id;

  }

}
