import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ForgetpasswordService } from './forgetpassword.service';
import { CreateForgetpasswordDto } from './dto/create-forgetpassword.dto';
import { UpdateForgetpasswordDto } from './dto/update-forgetpassword.dto';

@Controller('forgetpassword')
export class ForgetpasswordController {
  constructor(private readonly forgetpasswordService: ForgetpasswordService) {}

  @Post()
  create(@Body() createForgetpasswordDto: CreateForgetpasswordDto) {
    return this.forgetpasswordService.create(createForgetpasswordDto);
  }

 
}
