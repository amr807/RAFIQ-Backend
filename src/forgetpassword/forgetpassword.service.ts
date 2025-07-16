import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateForgetpasswordDto } from './dto/create-forgetpassword.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Repository } from 'typeorm';
import { Auth } from 'src/modules/manager';
import { MemcachedService } from '@andreafspeziale/nestjs-memcached/dist/memcached.service';
import { getConnections, DbConnections } from 'src/helper_connection.helper';
const sendForgotPasswordEmail = require("../emails/forgetpassemail");

@Injectable()
export class ForgetpasswordService {
  constructor(
    @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private readonly authRepository: Repository<Auth>,
    @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private readonly employeeRepository: Repository<Employee_db>,
    @Inject(MemcachedService) private readonly  memcachedService: MemcachedService,

  ) {}

  async create(createForgetpasswordDto: CreateForgetpasswordDto): Promise<{ message: string }> {
    const {email} = createForgetpasswordDto;
const isInManger=await this.findEmail(email,this.authRepository)
const  isInEmployee=await this.findEmail(email,this.employeeRepository)

    console.log(isInEmployee,isInManger)
    if ( isInManger!==null || isInEmployee!==null) { 
this.Aoth_save(email)
  
      
    }
   
    else{
      throw new NotFoundException('Email not found.');
}
  

    return { message: 'Password reset link sent to your email.' };
  }
  findEmail(email,Repository) {

    return Repository.findOneBy({ email:email });
  }
async Aoth_save(email){
  const pin= this.generateRandomPin()

  try{
    await sendForgotPasswordEmail(email,pin)
    await this.memcachedService.set(email,pin).then(()=>console.log("beensaved in cache...............")).catch((e)=>console.log(e))
  }catch(res){
   console.log(res)
   return new NotFoundException("Email not sent");
 
 }
}
 generateRandomPin = () => {
  return Math.floor(10000 + Math.random() * 90000); 
}; 

  
}

