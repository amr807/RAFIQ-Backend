import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { findIdByEmail } from 'src/db_fuction/find_id';
import { Employee_db } from 'src/modules/employee';
import { KPI } from 'src/modules/performance';
import { Repository } from 'typeorm';

@Controller()
export class KpiController {
      constructor(
@InjectRepository(Employee_db,'auth_db') private EmployeeRepository: Repository<Employee_db>,
        @InjectRepository(KPI,'task_db')
        private readonly kpiRepo: Repository<KPI>
      ) {}

    @Post('get_KpiforEmployee')
    async create(@Body() createKpiDto: {email:string}) {

const id=await findIdByEmail(createKpiDto.email,this.EmployeeRepository)
     const value=await this.kpiRepo.findOneBy({employeeId:String(id)})

return { Value:value.value  };
    }
}