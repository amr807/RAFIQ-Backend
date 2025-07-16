import { Module } from '@nestjs/common';
import { UserloginService } from './userlogin.service';
import { UserloginController } from './userlogin.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/Token.interface ';

@Module({
  imports:[
    
    process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Employee_db,Auth])
  : TypeOrmModule.forFeature([Employee_db,Auth],'auth_db')


    
    ],

  controllers: [UserloginController],
  providers: [UserloginService],
})
export class UserloginModule {}
