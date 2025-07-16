import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';

@Module({
   imports:[
    process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Auth,Employee_db])
  : TypeOrmModule.forFeature([Auth,Employee_db],'auth_db')


    
    
    ,JwtModule.register({      global: true    ,secret: process.env.JWT_PASS_SECRET , signOptions: { expiresIn: '1000s' },})]
  ,
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
})
export class ResetPasswordModule {}
