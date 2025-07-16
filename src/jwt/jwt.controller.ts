  
import { Controller, UseGuards, Post, NotFoundException,Request, Res, Req, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
@Controller()
export class JwtController {
constructor(    private jwtService: JwtService,private configService: ConfigService
){}


  @Post('refreshtoken_phone')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
      }
console.log(authHeader)

      const refreshToken = authHeader.split(' ')[1]; 
const secret=this.configService.get<string>('token_PASS_SECRET')
      if (!refreshToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token format' });
      }
      let payload: any;
      try {
        payload = this.jwtService.verify(String(refreshToken),{secret: secret});
 } catch (e) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired refresh token' });
      }

      const newAccessToken = await  this.get_phone(payload)

   

      return res.status(HttpStatus.CREATED).json({
        accessToken: newAccessToken,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
  }



@UseGuards(AuthGuard('jwt-refresh'))
  @Post('refreshtoken')
  async get_token(@Res({ passthrough: true }) res:Response,@Request() req,) {
    const result=await this.get(req.user)
    res.cookie('access_token', result.accessToken, { httpOnly: true, secure: true,sameSite:'lax', path: '/', maxAge: 30000 });
   
    return {accessToken:result.accessToken}
  }




async get_phone(createEmployeetaskDto) {
      const secret = this.configService.get<string>('JWT_PASS_SECRET'); 

      const accessToken = await this.jwtService.signAsync({sub:createEmployeetaskDto.sub,email:createEmployeetaskDto.email}, { expiresIn: '1m',secret:secret } );
return {accessToken:accessToken}

   
}

async get(createEmployeetaskDto) {
      const secret = this.configService.get<string>('JWT_PASS_SECRET'); 

      const accessToken = await this.jwtService.signAsync({sub:createEmployeetaskDto.userId,email:createEmployeetaskDto.email}, { expiresIn: '1m',secret:secret } );
return {accessToken:accessToken}

   
}


}