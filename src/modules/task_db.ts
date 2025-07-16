import { Column, Entity, Generated, JoinColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'task' })
export class Task_DB {
  @PrimaryGeneratedColumn('uuid')
id: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;
  @Column({ type: 'varchar', length: 30, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  status: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;


  @Column({ type: 'bool', nullable: false, default: false })
  completed: boolean;

  @Column({ default:  Date(), nullable: false })
  createdAt: string;
  @Column({ default:  Date(), nullable: false })
  deadline: string;

  @Column({ default: "varchar", nullable: false })
  Manage_id: string;
@Column({ type: 'interval', nullable: true })
expectedTravelTime: string; 

@Column({ type: 'interval', nullable: true })
actualTravelTime: string;

@Column({ type: 'timestamp', nullable: true })
completedAt: Date;
  @Column({ type: 'varchar', nullable: false })

  employee_id: string; 
   @Column({ type: 'jsonb', nullable: true })
   packageItems: { type: string; customType?: string; quantity: number }[];
  @Column({ type: 'double precision', name: 'amount' })
  amount: number;
  @Column({ type: 'double precision', name: 'd_lat' })
  lat: number;

  @Column({ type: 'double precision', name: 'd_long' })
  lon: number;

}
