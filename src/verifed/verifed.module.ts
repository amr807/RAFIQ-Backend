import { Module } from '@nestjs/common';
import { VerifedService } from './verifed.service';
import { VerifedController } from './verifed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';
import { Employee_db } from 'src/modules/employee';

@Module({
  imports:[
    process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Auth,Employee_db])
  : TypeOrmModule.forFeature([Auth,Employee_db],'auth_db')


    
    ],
  controllers: [VerifedController],
  providers: [VerifedService],
})
export class VerifedModule {}
