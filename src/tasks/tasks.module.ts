import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task_DB } from 'src/modules/task_db';
import { Auth } from 'src/modules/manager';
import { Employee_db } from 'src/modules/employee';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [   
             PassportModule.register({ defaultStrategy: 'jwt' }),
    
  ...(process.env.MODE === 'prod'
    ? [
        TypeOrmModule.forFeature([Auth, Employee_db,Task_DB]),
      ]
    : [
        TypeOrmModule.forFeature([Task_DB], 'task_db'),
                TypeOrmModule.forFeature([Auth,Employee_db],'auth_db'),

      ]),
              JwtModule
      ],
    
  controllers: [TasksController],
  providers: [TasksService],
  exports:[TasksService]
})
export class TasksModule {}
