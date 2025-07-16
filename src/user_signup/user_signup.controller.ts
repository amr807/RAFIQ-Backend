import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserSignupService } from './user_signup.service';
import { CreateUserSignupDto } from './dto/create-user_signup.dto';
import { UpdateUserSignupDto } from './dto/update-user_signup.dto';

@Controller('usersignup')
export class UserSignupController {
  constructor(private readonly userSignupService: UserSignupService) {}

  @Post()
  create(@Body() createUserSignupDto: CreateUserSignupDto) {
    return this.userSignupService.create(createUserSignupDto);
  }
 
}
