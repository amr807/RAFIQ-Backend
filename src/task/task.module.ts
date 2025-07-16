import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';
import { Employee_db } from 'src/modules/employee';
import { Task_DB } from 'src/modules/task_db';
import { NotifactionGateway } from 'src/notifaction/notifaction.gateway';
import { ManagerNotification } from 'src/modules/manager_notication';
import { EmployeeNotification } from 'src/modules/employee_notication';

@Module({
  imports: [
    ...(process.env.MODE === 'prod'
      ? [
          TypeOrmModule.forFeature(
            [Auth, Employee_db, Task_DB, ManagerNotification, EmployeeNotification]
          )
        ]
      : [
          TypeOrmModule.forFeature([Auth, Employee_db],'auth_db'), 
          TypeOrmModule.forFeature([Task_DB], 'task_db'),
          TypeOrmModule.forFeature([ManagerNotification, EmployeeNotification], 'notification')
        ]
    ),
  ],
  controllers: [TaskController],
 exports: [TaskService], 
  providers: [TaskService, NotifactionGateway],
})
export class TaskModule {}
