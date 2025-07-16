import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';

@Module({
  imports:[process.env.MODE == 'prod'
  ?   TypeOrmModule.forFeature([Employee_db,Auth])
  :   TypeOrmModule.forFeature([Employee_db,Auth],'auth_db')

  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
