import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInMinutes, isBefore } from 'date-fns';
import { KPI } from 'src/modules/performance';
import { Repository } from 'typeorm';
@Injectable()
export class KpiScoreService {
  constructor(
    
    @InjectRepository(KPI,'task_db')
    private readonly kpiRepo: Repository<KPI>
  ) {}

private readonly weights = {
  taskCompletionRate: 0.28,
  onTimeDelivery: 0.28,
  averageDeliveryTime: 0.22,
  idleTimeRatio: 0.11,
  distanceEfficiency: 0.11,
};
async CalculateMetrics(tasks,
    completedAt,
    deadline,startedAt,idleTimeRatio,actualDistance,plannedDistance){
const taskCompletionRate=  tasks.length > 0 ? tasks.filter((e) => e.completed).length / tasks.length : 0;

const averageDeliveryTime = differenceInMinutes(
    new Date(completedAt),
    new Date(startedAt),
  );
  const onTimeDelivery = isBefore(new Date(completedAt), new Date(deadline)) 
const distanceEfficiency =
  actualDistance && plannedDistance
    ? Math.min(1, plannedDistance / actualDistance)
    : 0;
console.log(onTimeDelivery,deadline)
return {
  taskCompletionRate,
  onTimeDelivery: onTimeDelivery ? 1 : 0,
  averageDeliveryTime,
  distanceEfficiency,
  idleTimeRatio

};

    }
  calculateKpiScore(metrics: {
  taskCompletionRate: number;    
  onTimeDelivery: number;        
  averageDeliveryTime: number;   
  idleTimeRatio: number;         
  distanceEfficiency: number;  
}): number {
  const {
    taskCompletionRate,
    onTimeDelivery,
    averageDeliveryTime,
    idleTimeRatio,
    distanceEfficiency,
  } = metrics;


const maxDeliveryTime = 30;    
  const maxIdleTimeRatio = 0.5;  // 50%

  const normalizedAvgTime = Math.max(0, 1 - averageDeliveryTime / maxDeliveryTime);
  const normalizedIdleRatio = Math.max(0, 1 - idleTimeRatio / maxIdleTimeRatio);

  const score =
    taskCompletionRate * this.weights.taskCompletionRate +
    onTimeDelivery * this.weights.onTimeDelivery +
    normalizedAvgTime * this.weights.averageDeliveryTime +
    normalizedIdleRatio * this.weights.idleTimeRatio +
    distanceEfficiency * this.weights.distanceEfficiency;

  return Number(score.toFixed(3));
}

  async saveMetric(metric: string, value: number, employeeId: string, managerId: string): Promise<void> {
    let record = await this.kpiRepo.findOne({
      where: { metric, employeeId, managerId },
    });

    if (record ) {
      record.value = value;
    } else {
      record = this.kpiRepo.create({ metric, value, employeeId, managerId });
    }
    await this.kpiRepo.save(record);
  }

  async UpdateeMetric(metric: number,task_ID:string,tasks): Promise<void> {
const existingValue=await this.kpiRepo.findOneBy({id:task_ID})
const taskCount=tasks.filter((e)=>e.completed).length
  const newValue = ( existingValue.value * taskCount + metric) / (taskCount + 1);

    await this.kpiRepo.update(task_ID, { value: newValue });
  }

  async updateTotalKpiScore(employeeId: string, managerId: string): Promise<number> {
    const metrics = await this.kpiRepo.find({ where: { employeeId, managerId } });
    const kpiData: any = {};

    for (const m of metrics) {
      if (m.metric === 'KPI_SCORE') continue;
      kpiData[m.metric] = m.value;
    }

    const score =await this.calculateKpiScore(kpiData);
    await this.saveMetric('KPI_SCORE',  score, employeeId, managerId);
    return score;
  }

  async deleteMetric(metric: string, employeeId: string, managerId: string): Promise<void> {
    await this.kpiRepo.delete({ metric, employeeId, managerId });
    if (metric !== 'KPI_SCORE') {
      await this.updateTotalKpiScore(employeeId, managerId);
    }
  }

  async getAllKpi(employeeId: string, managerId: string): Promise<KPI[]> {
    return await this.kpiRepo.find({ where: { employeeId, managerId } });
  }
}
