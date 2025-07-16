import { Column, Entity, Generated, JoinColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Auth } from './manager';

@Entity()
export class Employee_db {
  @PrimaryGeneratedColumn('uuid')
  user_id: string; 

  @Column({ type: 'varchar', length: 40 , nullable: false})
  firstname:String

@Column({ type: 'varchar', length: 40 , nullable: false})
  lastname:String
;

  @Column({ type: 'varchar', length: 40, nullable: false })
  email: string;

  @Column({   type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'bool', nullable: false, default: false })
  verified: boolean;
  @Column({ type: 'bool', nullable: false, default: true })
  Isfirstlogin: boolean;

  @Column({ default:  Date(), nullable: false })
  createdAt: string;

  @Column({ default: "user", nullable: false })
  role: string;
  @Column({ type: 'varchar', nullable: true })
  phone:string 
    @Column({ type: 'varchar', nullable: true })
    vehicle:string
  // Relationship with the Auth entity
  @Column({ type: 'varchar', length: 40, nullable: false })

  manager: string; 

}
