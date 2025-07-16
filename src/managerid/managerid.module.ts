import { Module } from '@nestjs/common';
import { ManageridController } from './managerid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';

@Module({
  imports: [process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Auth])
  : TypeOrmModule.forFeature([Auth], 'auth_db')

],
  controllers: [ManageridController],
})
export class ManageridModule {}
