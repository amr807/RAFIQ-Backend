import { Module } from '@nestjs/common';
import { KpiScoreService } from './kpi.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { KPI } from 'src/modules/performance';
import { Employee_db } from 'src/modules/employee';
import { KpiController } from './Kpi.controller';

@Module({
    imports: [
            ...(process.env.MODE === 'prod'
      ? [
          TypeOrmModule.forFeature([KPI, Employee_db]),
        ]
      : [          TypeOrmModule.forFeature([KPI], 'task_db'),
          TypeOrmModule.forFeature([Employee_db],'auth_db'),
]),

  ],
controllers:[KpiController],
    providers: [KpiScoreService],
    exports: [KpiScoreService],
})
export class KpiModule {}