import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Res } from '@nestjs/common';
import { UserloginService } from './userlogin.service';
import { Response } from 'express';

@Controller()
export class UserloginController {
  constructor(private readonly userloginService: UserloginService) {}

  @Post('userlogin')
  async create(@Res({ passthrough: true }) res:Response,@Body() createUserloginDto) {
   const result=await this.userloginService.create(createUserloginDto)
  if(result.status==202){
  res.cookie('access_token', result.accessToken, { httpOnly: true, secure: true,sameSite:'lax', path: '/', maxAge: 3600 * 1000 });
res.cookie('refresh_token', result.token, { httpOnly: true, secure: true, path: '/',sameSite:'lax', maxAge: 30 * 24 * 3600 * 1000 });
 
return { message: 'Login successful',
  Auth:{...result.Auth,isfirstlogin:result.Isfirstlogin},
  status:202,
}}
  return result
  
  }
}
