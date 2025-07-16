import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateManageridDto } from './dto/create-managerid.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';
import { Repository } from 'typeorm';
import { findIdByEmail } from 'src/db_fuction/find_id';

@Controller('Managerid')
export class ManageridController {
  constructor(    @InjectRepository(Auth,'auth_db') private AuthRepository: Repository<Auth>,
  ) {}

  @Post()
  async create(@Body() createManageridDto: CreateManageridDto) {

const id =await findIdByEmail(createManageridDto.email,this.AuthRepository)
return {id:String(id)}
  }

 
}
