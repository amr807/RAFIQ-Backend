import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { CreateSignupDto } from './dto/create-signup.dto';
import { Repository } from 'typeorm';
import { Auth } from 'src/modules/manager';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Employee_db } from 'src/modules/employee';
import { UserRole } from 'src/types/role';
import { PinManager } from 'src/encryption/encriptionfunction';
import { getConnections, DbConnections } from 'src/helper_connection.helper';

const bcrypt = require("bcrypt");
const sendMail = require("../emails/sendemail.js");

@Injectable()
export class SignupService {
  private readonly logger = new Logger(SignupService.name);

  constructor(
    @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeRepository: Repository<Employee_db>,
    @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private AuthRepository: Repository<Auth>,
    private jwtService: JwtService,
    private pinservice:PinManager

  ) {}

  async create(createSignupDto: CreateSignupDto){
    this.validateSignupData(createSignupDto);
    const { email, password, firstname, lastname } = createSignupDto;

    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      this.logger.warn(`Email is already used: ${email}`);

      if (!existingUser.verified) {
        this.logger.log(`Deleting unverified user: ${email}`);
        await this.deleteUser(existingUser);
      } else {
        throw new UnauthorizedException('Cerdentail is invaild.');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const pin = this.generateRandomPin(8);
    const hashedPin = await this.pinservice.encrypt(pin)
    const newAuth = this.AuthRepository.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      pin: hashedPin,
      verified: false, 
      role: UserRole.MANAGER,
    });

    await this.AuthRepository.save(newAuth);

    const token = await this.jwtService.signAsync({ sub: newAuth.id, email: newAuth.email });
    const url = `${process.env.BASE_URL_FRONTEND}/user/verify/${token}`;

        await this.sendVerificationEmail(email, pin, url);
    this.logger.log(`Verification email sent to: ${email}`);
    
  }

  async login(email: string, password: string): Promise<{ message: string }> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    if (!user.verified) {
      this.logger.warn(`User not verified, deleting: ${email}`);
      await this.deleteUser(user);
      throw new UnauthorizedException('User is not verified. Please sign up again.');
    }

    return { message: 'Login successful.' };
  }

  private validateSignupData(data: CreateSignupDto) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!emailRegex.test(data.email)) {
      throw new BadRequestException('Invalid email format');
    }
    if (!passwordRegex.test(data.password)) {
      throw new BadRequestException('Password must be at least 8 characters long and contain both letters and numbers');
    }
    if (!nameRegex.test(data.firstname) || !nameRegex.test(data.lastname)) {
      throw new BadRequestException('First name and Last name must contain only letters');
    }
  }

  private async findUserByEmail(email: string): Promise<Auth | Employee_db | null> {
    return (
      (await this.AuthRepository.findOneBy({ email })) ||
      (await this.EmployeeRepository.findOneBy({ email }))
    );
  }

  private async deleteUser(user: Auth | Employee_db) {
    if (user instanceof Auth) {
      await this.AuthRepository.delete({ email: user.email });
    } else {
      await this.EmployeeRepository.delete({ email: user.email });
    }
  }

  private generateRandomPin(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }
async sendVerificationEmail(email: string, pin: string,url) {
  try{
    await sendMail(email, url)
    this.logger.log(`Verification email sent to: ${email}`);
    this.logger.log(`Signup completed: ${email}`);
    this.logger.debug(`Verification URL: ${url}`);
    this.logger.log(`Generated PIN: ${pin}`);
    return ;}
    catch(error)  {
      this.logger.error(`Failed to send verification email: ${error}`);
   throw new BadRequestException('Failed to send verification email.')
 ;};
}


}
