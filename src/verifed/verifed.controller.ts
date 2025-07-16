import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerifedService } from './verifed.service';

@Controller('verifed')
export class VerifedController {
  constructor(private readonly verifedService: VerifedService) {}

  @Post()
  create(@Body() createVerifedDto) {
    return this.verifedService.create(createVerifedDto);
  }

  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.verifedService.findOne(+id);
  }

}
