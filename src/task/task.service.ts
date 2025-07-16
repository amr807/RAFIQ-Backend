import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task_DB } from 'src/modules/task_db';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from 'src/modules/manager';
import { Employee_db } from 'src/modules/employee';
import { findIdByEmail } from 'src/db_fuction/find_id';
import {  NotificationChannel, NotificationPriority, NotificationType } from 'src/modules/notication';
import { NotifactionGateway } from 'src/notifaction/notifaction.gateway';
import { ManagerNotification } from 'src/modules/manager_notication';
import { EmployeeNotification } from 'src/modules/employee_notication';
import { DbConnections, getConnections } from 'src/helper_connection.helper';


@Injectable()
export class TaskService {
  constructor(    @InjectRepository(Task_DB,getConnections(DbConnections.TASK)) private Taskrespository: Repository<Task_DB>,
    @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private AuthRepository: Repository<Auth>,
      @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeRepository: Repository<Employee_db>,
      @InjectRepository(ManagerNotification,getConnections(DbConnections.NOTIFICATION))  readonly notifactionRepository: Repository<ManagerNotification>,
      @InjectRepository(EmployeeNotification,getConnections(DbConnections.NOTIFICATION))  readonly EmployeenotifactionRepository: Repository<EmployeeNotification>,
          private readonly myGateway: NotifactionGateway

  
    ){}

  async create(createTaskDto: CreateTaskDto) {
    const task = this.Taskrespository.create(createTaskDto);
 const manager_id=await findIdByEmail(createTaskDto.email,this.AuthRepository)
    
 task.Manage_id= String(manager_id);
task.employee_id=createTaskDto.employeeName;
task.name=createTaskDto.employee_id
task.createdAt=Date()
console.log(manager_id)
await this.Taskrespository.save(task)
const notificationEmployee = this.EmployeenotifactionRepository.create({
  recipient_id: createTaskDto.employeeName,
  type: NotificationType.ASSIGNMENT,
  channel: NotificationChannel.PUSH,
  priority: NotificationPriority.NORMAL,
  title: 'New Task Assigned',
  content: `You have a new task: ${task.title}`,
  created_at: new Date(),
  updated_at: new Date(),
});
const notificationManager = this.notifactionRepository.create({
  recipient_id: String(manager_id),
  task_id:task.id,
  type: NotificationType.ASSIGNMENT,
  channel: NotificationChannel.IN_APP,
  priority: NotificationPriority.NORMAL,
  title: 'New Task Assigned',
  content: `new task ${task.title} have been assigned to ${createTaskDto.employee_id}`,
  created_at: new Date(),
  updated_at: new Date(),
  
});

this.EmployeenotifactionRepository.save(notificationEmployee)
this.notifactionRepository.save(notificationManager)

this.myGateway.notifincationmanager({id:String(manager_id),notification:notificationManager}); // Emit the event to all connected clients
this.myGateway.notifincationemployee({id:createTaskDto.employeeName,notification:{...notificationEmployee,name:task.name}}); 
return task ;
  }
  
}
