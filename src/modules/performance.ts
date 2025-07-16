import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class KPI {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  employeeId: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  managerId: string;

  @Column({ type: 'varchar', nullable: false }) // e.g. 'taskCompletionRate', 'KPI_SCORE'
  metric: string;

  @Column('float')
  value: number;

  @CreateDateColumn()
  createdAt: Date;

@UpdateDateColumn()
Update:Date;
}
