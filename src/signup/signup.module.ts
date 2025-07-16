import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';
import { EncryptionModule } from 'src/encryption/encryptionModule.module';

@Module({
  imports:[EncryptionModule,
    process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Auth,Employee_db])
  : TypeOrmModule.forFeature([Auth,Employee_db],'auth_db')


    
    ,JwtModule.register({      global: true    ,secret: process.env.JWT_PASS_SECRET , signOptions: { expiresIn: '700s' }})],
  controllers: [SignupController],
  providers: [SignupService]})
export class SignupModule {}
