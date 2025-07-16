import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from 'src/modules/manager';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports:[  TypeOrmModule.forFeature( [Auth],'auth_db'),JwtModule.register({ secret: 'hard!to-guess_secret' }),  
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
