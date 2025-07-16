import { Injectable } from '@nestjs/common';
import { CreateVerifedDto } from './dto/create-verifed.dto';
import { UpdateVerifedDto } from './dto/update-verifed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';
import { Repository } from 'typeorm';
import { Employee_db } from 'src/modules/employee';
import { getConnections, DbConnections } from 'src/helper_connection.helper';

@Injectable()
export class VerifedService {
  constructor(
    @InjectRepository(Auth,getConnections(DbConnections.AUTH)) private AuthRepository: Repository<Auth>,
    @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeRepository: Repository<Employee_db>,
  ) {}

  async create(createVerifedDto: CreateVerifedDto): Promise<{ message: string }> {
    const auths_manager = await this.AuthRepository.create(createVerifedDto);
    const auths_employee = await this.EmployeeRepository.create(createVerifedDto);

    if (auths_manager !== undefined) {
      await this.verifyAndDelete(auths_manager.email, this.AuthRepository);
    }
    if (auths_employee !== undefined) {
      await this.verifyAndDelete(auths_employee.email, this.EmployeeRepository);
    }

    return { message: 'Verification process completed.' };
  }

  async verifyAndDelete(email: String, repository: Repository<any>): Promise<void> {
    const user = await repository.findOneBy({ email });

    if (user && !user.verified) {
      console.log('Unverified user found:', user);

      const verificationTime = user.createdAt.toString();
      const currentTime = new Date();
      const timeDifference = currentTime.getTime() - new Date(verificationTime).getTime();

      if (timeDifference > 86400000) {
        const unverifiedUsers = await repository.find({ where: { verified: false } });
        await repository.remove(unverifiedUsers);
        console.log(`User with email ${email} has been deleted due to unverified status for 24+ hours.`);
        return;
      }

      // Mark the user as verified
      user.verified = true;
      await repository.save(user);
      console.log('User verified:', user);
    } else {
      console.log('User is already verified or does not exist.');
    }
  }

  async findEmail(email: String, repository: Repository<any>) {
    return repository.findOneBy({ email });
  }

  findOne(id: number) {
    return `This action returns a #${id} verified user`;
  }

  async updateVerified(email: string, repository: Repository<any>) {
    const user = await repository.findOneBy({ email, verified: false });
    if (user) {
      user.verified = true;
      return repository.save(user);
    }
    return null;
  }

  async removeUnverified(email: string, repository: Repository<any>) {
    const unverifiedUsers = await repository.find({ where: { email, verified: false } });
    console.log('Unverified users to delete:', unverifiedUsers);
    return repository.remove(unverifiedUsers);
  }
}