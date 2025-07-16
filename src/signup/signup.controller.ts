import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode } from '@nestjs/common';
import { SignupService } from './signup.service';
import { CreateSignupDto } from './dto/create-signup.dto';
import { UpdateSignupDto } from './dto/update-signup.dto';


@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('/')
  create(@Body() createSignupDto: CreateSignupDto) {
   console.log(process.env.MODE)
    return this.signupService.create(createSignupDto);
  } 

 


  
 

  

}
