import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Employee_db } from 'src/modules/employee';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from 'src/modules/manager';
import { ConfigService } from '@nestjs/config';
import { getConnections, DbConnections } from 'src/helper_connection.helper';

@Injectable()
export class UserloginService {
  constructor(
    @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeRepository: Repository<Employee_db>,
    @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private AuthRepository: Repository<Auth>,
    private jwtService: JwtService,private configService: ConfigService
  ) {}

  async create(createUserloginDto) {
    const obj = { "error": "email or password is not correct", status: 401 };
console.log(createUserloginDto)
    const auths_manager = createUserloginDto;
    const auths_employee = createUserloginDto;

    const isInManagerDb = await this.findAll(auths_manager.email, this.AuthRepository);
    const isInEmployeeDb = await this.findAll(auths_employee.email, this.EmployeeRepository);

    console.log(auths_employee, auths_manager);

    if (isInManagerDb !== null) {
      console.log("Manager", auths_manager);
      const r = await this.loginOperation(auths_manager, this.AuthRepository);

      console.log(r);
      if (r?.status == 401) {
        throw new UnauthorizedException(obj);
      }
      if (r?.status == 202) {
        return {
          isfirstlogin:r?.Isfirstlogin,
...r        };
      }
    } else if (isInEmployeeDb !== null) {
      console.log("Employee", auths_employee);
      const r = await this.loginOperation(auths_employee, this.EmployeeRepository);
      if (r?.status == 401) {
        throw new UnauthorizedException(obj.error);
      }
      if (r?.status == 202) {
        return {
                    isfirstlogin:r?.Isfirstlogin,

         ...r
        };
      }
    } else {
      throw new UnauthorizedException(obj);
    }

    return;
  }

  async loginOperation(auth, Repository) {
  
    const encrpt = require("bcrypt");
    const obj = "email or password is not correct";
 
    const email = auth.email;
    const password = auth.password;
    
const user=    await this.findAll(email, Repository)
let id=user.role=="Employee"?user.user_id:user.id
let UserArray = user.email;
let PassArray = user.password;
let verifiedUser = user.verified;
let UserRole = user.role;
let firstname = user.firstname;
let lastname = user.lastname;
let Isfirstlogin = user.Isfirstlogin;
    if (email !== UserArray || await encrpt.compare(password, PassArray) === false || verifiedUser == false) {
      console.log("email or password is not correct ......❌❌❌❌❌");
      return { error: obj, status: 401 };
    } else {    

      const payload = { 
        sub: id,
        email:UserArray , 
        role: UserRole, 
        firstname: firstname, 
        lastname: lastname 
      };
      const secret = this.configService.get<string>('JWT_PASS_SECRET'); 
const token= await this.jwtService.signAsync(payload, { expiresIn: '30 days',secret:this.configService.get<string>('token_PASS_SECRET' )} )
      const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1m',secret:secret } );
            console.log(accessToken,"secret:",secret);
      return {
      accessToken,
token   , Auth:payload ,
status: 202     ,  Isfirstlogin: Isfirstlogin
};
    }
  }

  findAll(email, Repository) {
    return Repository.findOneBy({
      email: email
    });
  }

}