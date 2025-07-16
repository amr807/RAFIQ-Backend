
import { Column, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Employee_db } from './employee';

@Entity()
export class Auth {
  @PrimaryColumn({ default: () => "uuid_generate_v4()" })

id: string;

  @Column({ type: 'varchar', length:40 , nullable: false})
    firstname:String

  @Column({ type: 'varchar', length: 40 , nullable: false})
    lastname:String
  ;
  @Column({ type: 'varchar', length: 40 ,nullable: false})
    email:String 

    @Column({ type: 'varchar',nullable: false })
    password:String ;
    
    @Column({ type: 'varchar',nullable: false })
    pin:String ;
    @Column({ type: 'varchar', nullable: true })
    phone:string 
  
    @Column({ type: 'bool',nullable: false ,default:false})
  verified:Boolean 
  @Column({ type: 'bool', nullable: false, default: true })
  Isfirstlogin: boolean;

  @Column({default:Date(),nullable: false})
  createdAt:  string;
  @Column({default:"user",nullable: false})
  role:  string;
  @OneToMany(() => Employee_db, (employee) => employee.manager)
  employees: Employee_db;

}

