import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UpdatepasswordService } from './updatepassword.service';
import { CreateUpdatepasswordDto, GetPinDto, Uptdatepin } from './dto/create-updatepassword.dto';
import { UpdateUpdatepasswordDto } from './dto/update-updatepassword.dto';

@Controller()
export class UpdatepasswordController {
  constructor(private readonly updatepasswordService: UpdatepasswordService,
  ) {}

  @Post("updatepassword")
  create(@Body() createUpdatepasswordDto: CreateUpdatepasswordDto) {
    return this.updatepasswordService.create(createUpdatepasswordDto);
  }

  @Post("getpin")
  get(@Body() createUpdatepasswordDto: GetPinDto) {

  
    return      this.updatepasswordService.getpin(createUpdatepasswordDto);
    ;
  }
  @Put("editpin")
  UPdate(@Body() createUpdatepasswordDto: Uptdatepin) {

  
    return      this.updatepasswordService.UPdate(createUpdatepasswordDto);
    ;
  }
}