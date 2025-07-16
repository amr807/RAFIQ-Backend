import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';
import { Repository } from 'typeorm';
import { MemcachedService } from '@andreafspeziale/nestjs-memcached';
import { getConnections, DbConnections } from 'src/helper_connection.helper';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private authRepository: Repository<Auth>,
      @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private employeeRepository: Repository<Employee_db>,
      @Inject(MemcachedService) private readonly memcachedReoo:MemcachedService,
      private jwtService: JwtService){}
  async create(createResetPasswordDto: CreateResetPasswordDto){
    const {email,pinAouth} = createResetPasswordDto;
    console.log(email,pinAouth)
const isInManger=await this.findEmail(email,this.authRepository)
const  isInEmployee=await this.findEmail(email,this.employeeRepository)   
if(isInManger !==null || isInEmployee !==null){
let isincashe=  await this.checkcache(email,pinAouth)
  console.log(isincashe)

if(isincashe ){
  const payload = { email: email, pin: pinAouth };
  return {
    access_token: this.jwtService.sign(payload),
  };
 
}
else{
throw new UnauthorizedException('Pin not found')
}


  }
  
else{ 
  throw new NotFoundException('Email not found')
}
  }


  findEmail(email,Repository) {
    return Repository.findOneBy({ email:email });
  }
  async checkcache(email,pin){
const cache=await this.memcachedReoo.get(email)
  console.log("cache",cache,pin)  

if(cache!==null){
if(cache !==pin){
return false
}

else{
return true
}
}
else{
return false
}

}
}
