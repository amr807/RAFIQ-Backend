import { Module } from '@nestjs/common';
import { ManagernotificationsController } from './managernotifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerNotification } from 'src/modules/manager_notication';
import { Auth } from 'src/modules/manager';
import { EmployeeNotification } from 'src/modules/employee_notication';
import { Employee_db } from 'src/modules/employee';

@Module({
  imports: [
        ...(process.env.MODE === 'prod'
      ? [
          TypeOrmModule.forFeature([ManagerNotification, EmployeeNotification,Auth, Employee_db]),
        ]
      : [ 
        TypeOrmModule.forFeature([ManagerNotification,EmployeeNotification], 'notification'),TypeOrmModule.forFeature([Auth,Employee_db],'auth_db')]),

    
    ],
  controllers: [ManagernotificationsController],
})
export class ManagernotificationsModule {}
