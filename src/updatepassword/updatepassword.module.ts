import { Module } from '@nestjs/common';
import { UpdatepasswordService } from './updatepassword.service';
import { UpdatepasswordController } from './updatepassword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';
import { PinManager } from 'src/encryption/encriptionfunction';
import { EncryptionModule } from 'src/encryption/encryptionModule.module';

@Module({
  imports: [EncryptionModule,
    process.env.MODE == 'prod'
  ?TypeOrmModule.forFeature([Auth,Employee_db])
  : TypeOrmModule.forFeature([Auth,Employee_db],'auth_db')


    ],
  controllers: [UpdatepasswordController],
  providers: [UpdatepasswordService],
})
export class UpdatepasswordModule {}
