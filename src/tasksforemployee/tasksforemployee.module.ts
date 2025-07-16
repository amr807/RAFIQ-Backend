import { Module } from '@nestjs/common';
import { TasksforemployeeService } from './tasksforemployee.service';
import { TasksforemployeeController } from './tasksforemployee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task_DB } from 'src/modules/task_db';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';
import { ConfigModule } from '@nestjs/config';

@Module({
 imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ...(process.env.MODE === 'prod'
      ? [
          TypeOrmModule.forFeature([Employee_db, Task_DB]),
        ]
      : [
          TypeOrmModule.forFeature([Employee_db],'auth_db'),           // default connection
          TypeOrmModule.forFeature([Task_DB], 'task_db'),       // 'task' connection
        ]),
  ],
  controllers: [TasksforemployeeController],
  providers: [TasksforemployeeService],
})
export class TasksforemployeeModule {}
