import { Injectable } from '@nestjs/common';

import { Auth } from 'src/modules/manager';
import {  Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dto/create-EmployeeCompleteprofile.dto';
import { UpdateAdminDto } from './dto/update-EmployeeCompleteprofile.dto';
import { findIdByEmail } from 'src/db_fuction/find_id';
import { DbConnections,getConnections } from 'src/helper_connection.helper';
@Injectable()
export class AdminService {
  constructor(@InjectRepository(Auth,getConnections(DbConnections.AUTH)) private AuthRepository: Repository<Auth>,    private jwtService: JwtService,  ) {}
  async create(createAdminDto: CreateAdminDto): Promise< Auth > {
    const auth=await this.AuthRepository.create(createAdminDto)

    console.log(await this.findAll())
    return auth;
  }

  findAll() {

  // return this.AuthRepository.find({
  //   select: ['username'],
  // })
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  async update( updateAdminDto: UpdateAdminDto) {
   const id=   await findIdByEmail(updateAdminDto.email, this.AuthRepository) as unknown  as Auth
 const phone=`(${updateAdminDto.country_code})${updateAdminDto.phone}`
 await this.AuthRepository.update(id, {
   Isfirstlogin: false,
   phone: phone,
 });
 return 
}
}




