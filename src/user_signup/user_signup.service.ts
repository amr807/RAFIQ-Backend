import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserSignupDto } from './dto/create-user_signup.dto';
import { Employee_db } from 'src/modules/employee';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Auth } from 'src/modules/manager';
import { PinManager } from 'src/encryption/encriptionfunction';
import { promises } from 'dns';
import { getConnections, DbConnections } from 'src/helper_connection.helper';

const encrpt = require("bcrypt"); 
const crypto = require("crypto");
const sendMail = require("../emails/sendemail.js");
@Injectable()
export class UserSignupService {
  constructor(
    @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeRepository: Repository<Employee_db>,
    @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private AuthRepository: Repository<Auth>,
    private pinservice:PinManager
  ) {}

  async create(createUserSignupDto: CreateUserSignupDto): Promise<{ isFirsttime: boolean }> {
    const EmployeeAuth = await this.EmployeeRepository.create(createUserSignupDto);
    const yeeAuth = createUserSignupDto;
    const obj = { error: 'Credientil is invaild' };
    const email = EmployeeAuth.email;
    const salt = await encrpt.genSalt(10);
    const password = await encrpt.hash(EmployeeAuth.password, salt);
    EmployeeAuth.password = password;

    const user_db_email = await this.findemail(email);

    const pin = await this.findpin(yeeAuth.pin.toString());

    if (user_db_email || pin === false) {
      console.log('Email is already used or PIN is invalid ......❌❌❌❌❌');
      throw new UnauthorizedException(obj.error);
    } else {
      EmployeeAuth.manager = pin;
EmployeeAuth.verified = true;

      await this.EmployeeRepository.save(EmployeeAuth);

        console.log('done.......✅✅✅✅');

      return {isFirsttime:true};
    }
  }

  async findemail(email: string) {
    return this.EmployeeRepository.findOneBy({ email });
  }

  async findpin(pin: string) {
    const users = await this.AuthRepository.find(); 
 const matchedUser = users.find((e) => this.pinservice.decrypt(String(e.pin)) === pin);
 return matchedUser ? matchedUser.id : false;

  }

 
}