import { Module } from '@nestjs/common';
import { EmployeetaskService } from './employeetask.service';
import { EmployeetaskController } from './employeetask.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';
import { Task_DB } from 'src/modules/task_db';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { KpiScoreService } from 'src/kpi/kpi.service';
import { KpiModule } from 'src/kpi/kpi.module';
import { KPI } from 'src/modules/performance';

@Module({
  imports: [  
         PassportModule.register({ defaultStrategy: 'jwt' }),
           ...(process.env.MODE === 'prod'
      ? [
          TypeOrmModule.forFeature([Auth, Employee_db,Task_DB,KPI]),
        ]
      : [         TypeOrmModule.forFeature([Auth,Employee_db],'auth_db'), 
          TypeOrmModule.forFeature([Task_DB,KPI], 'task_db'),
]),

         
          JwtModule,KpiModule
  ],
  controllers: [EmployeetaskController],
  providers: [EmployeetaskService],
})
export class EmployeetaskModule {}
