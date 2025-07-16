import { Module } from '@nestjs/common';
import { UserSignupService } from './user_signup.service';
import { UserSignupController } from './user_signup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/Interface.empylee';
import { Auth } from 'src/modules/manager';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionModule } from 'src/encryption/encryptionModule.module';

@Module({
  imports:[EncryptionModule,
    
    process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Employee_db,Auth])
  : TypeOrmModule.forFeature([Employee_db,Auth],'auth_db')


    
    
    ,JwtModule.register({      global: true    ,secret: process.env.JWT_PASS_SECRET , signOptions: { expiresIn: '700s' }})],
  controllers: [UserSignupController],
  providers: [UserSignupService],
})
export class UserSignupModule {}
