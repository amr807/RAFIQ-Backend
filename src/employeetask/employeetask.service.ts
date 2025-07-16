import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeetaskDto } from './dto/create-employeetask.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Task_DB } from 'src/modules/task_db';
import {   Repository } from 'typeorm';
import { findIdByEmail } from 'src/db_fuction/find_id';
import { CompleteTask } from './dto/update-employeetask.dto';
import { KpiScoreService } from 'src/kpi/kpi.service';
import { KPI } from 'src/modules/performance';
import { DbConnections, getConnections } from 'src/helper_connection.helper';

@Injectable()
export class EmployeetaskService {
  constructor(    @InjectRepository(Task_DB,getConnections(DbConnections.TASK)) private Taskrespository: Repository<Task_DB>,
@InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeRepository: Repository<Employee_db>,
private KpiModule:KpiScoreService,    @InjectRepository(KPI,'task_db')
    private readonly kpiRepo: Repository<KPI>

  ){}
   async get(createEmployeetaskDto: CreateEmployeetaskDto) {
try{ 
const employee_id=await findIdByEmail(createEmployeetaskDto.email,this.EmployeeRepository)
  const task = await this.findAllemployee(employee_id,this.Taskrespository);

  return task;
 }
 catch(error){
  console.log(error)
throw new NotFoundException("email not found")}

}    async findAllemployee(id,Repository: Repository<Task_DB>) {
  const task= await Repository.find({where: {employee_id:id}})
  return task;
    }
async Complete_task(CreateTaskDto:CompleteTask){
  const  task=await this.Taskrespository.findOneBy({id:CreateTaskDto.taskId})
const tasks=await this.Taskrespository.find({where:{employee_id:task.employee_id}})
const IsEmployee=await this.kpiRepo.find({where:{employeeId:task.employee_id}})

await this.Taskrespository.update(CreateTaskDto.taskId,{status:"complete",completed:true})
  const metrics =await this.KpiModule.CalculateMetrics(tasks,CreateTaskDto.completedAt,task.deadline,CreateTaskDto.startedAt,CreateTaskDto.Idletime,CreateTaskDto.actualDistance,CreateTaskDto.plannedDistance)
    const score =  this.KpiModule.calculateKpiScore(metrics);
if(IsEmployee.length==0){
  await this.KpiModule.saveMetric(
  'overallKpiScore',
     score,
       task.employee_id,
  task.Manage_id,
  );
}
else{
const id=await this.kpiRepo.findOneBy({employeeId:task.employee_id})
 console.log(id)
await this.KpiModule.UpdateeMetric(score,id.id,tasks)
}

  return { metrics, score };

}


async Uptdate(CreateTaskDto:{taskId:string}){
    const  task=await this.Taskrespository.findOneBy({id:CreateTaskDto.taskId})

await this.Taskrespository.update(CreateTaskDto.taskId,{status:"Progress ",completed:true})

}
}
