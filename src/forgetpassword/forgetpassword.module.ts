import { Module } from '@nestjs/common';
import { ForgetpasswordService } from './forgetpassword.service';
import { ForgetpasswordController } from './forgetpassword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from 'src/modules/manager';
import { Employee_db } from 'src/modules/employee';

@Module({
  imports:[
    process.env.MODE == 'prod'
  ?     TypeOrmModule.forFeature([Auth,Employee_db])

  :     TypeOrmModule.forFeature([Auth,Employee_db],'auth_db')


  
  
  
  ,JwtModule.register({ secret: 'hard!to-guess_secret' }),],  

  controllers: [ForgetpasswordController],
  providers: [ForgetpasswordService],
})
export class ForgetpasswordModule {}
