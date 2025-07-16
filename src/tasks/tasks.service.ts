import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task_DB } from 'src/modules/task_db';
import { Repository } from 'typeorm';
import { Employee_db } from 'src/modules/employee';
import { CreateEmployeetaskDto } from 'src/employeetask/dto/create-employeetask.dto';
import { getConnections, DbConnections } from 'src/helper_connection.helper';

@Injectable()
export class TasksService {
 constructor(    @InjectRepository(Task_DB,getConnections(DbConnections.TASK)) private Taskrespository: Repository<Task_DB>,
@InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeRepository: Repository<Employee_db>,

  ){}
 async create(createEmployeetaskDto: CreateEmployeetaskDto) {
  console.log("email",createEmployeetaskDto)
 try{ 

  const task = await this.findAll(createEmployeetaskDto.userId,this.Taskrespository);

  return {task:task,manager_id:createEmployeetaskDto.userId};
 }
 catch(error){
  console.log(error)
throw new NotFoundException("email not found")}

}

async findname(id,Repository){
  const employee_names= await Repository.findOneBy({id })

  return `${employee_names.firstname} ${employee_names.lastname}` ;
  }
  async findId(email: string,Repository) {
    if(email!==undefined){
      const user_id=  await Repository.findOneBy({email:email})
     return user_id.id;}
     throw new Error("email not found")
  
  }
  async findAll(id,Repository) {
const task= await Repository.find({where: {Manage_id: id}})
return task;
  }
}
