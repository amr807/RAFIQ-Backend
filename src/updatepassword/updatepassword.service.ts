import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUpdatepasswordDto, GetPinDto,Uptdatepin } from './dto/create-updatepassword.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Auth } from 'src/modules/manager';
import { Repository } from 'typeorm';
import { PinManager } from 'src/encryption/encriptionfunction';
import { getConnections, DbConnections } from 'src/helper_connection.helper';
const encrpt = require("bcrypt"); 

@Injectable()
export class UpdatepasswordService {

  constructor(

      @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private authRepository: Repository<Auth>,
        @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private employeeRepository: Repository<Employee_db>,
        private pinservice:PinManager
  
      ){}   

  async create(createUpdatepasswordDto: CreateUpdatepasswordDto) {
   const {email,newPassword} = createUpdatepasswordDto;
   console.log(email,newPassword)
   const isInManger=await this.findEmail(email,this.authRepository)
const isInEmployee=await this.findEmail(email,this.employeeRepository)
  if(isInManger !==null){
    await this.updateVerified(isInManger,this.authRepository,newPassword);
  }
  else if(isInEmployee !==null){
    await this.updateVerified(isInEmployee,this.employeeRepository,newPassword);
  }
  else{
    throw new NotFoundException('Email not found')
  }
  
  


} async updateVerified(email, repository: Repository<any>,password:String) {
  const salt = await encrpt.genSalt(10);
  const passwordhased = await encrpt.hash(password, salt); 
  email.password=passwordhased;
    await repository.save(email);
    return { message: 'Password updated successfully.' };
  }
  async findEmail(email: String, repository: Repository<any>) {
    return repository.findOneBy({ email });
  }
async getpin(create:GetPinDto){
  const pin= (await this.authRepository.findOneBy({email:create.email})).pin

return  this.pinservice.decrypt(String(pin))
}
async UPdate(Uptdatepin:Uptdatepin){

  const pin=await this.pinservice.encrypt(Uptdatepin.newPassword);
  
  await this.authRepository.update({email:Uptdatepin.email},{pin:pin})

return {message:"pin has been successfully updated"}
}
}