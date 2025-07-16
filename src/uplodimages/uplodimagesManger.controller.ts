import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from 'src/azure-storage/azure-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';
import { Repository } from 'typeorm';
import { DbConnections, getConnections } from 'src/helper_connection.helper';

@Controller('uploadimagesManger')
export class UploadController {
  constructor(private readonly azureBlobService: AzureBlobService,@InjectRepository(Auth,getConnections(DbConnections.AUTH))   private  AuthRepo:Repository<Auth>) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File,@Body() uploadImages) {
   const id=await this.find(uploadImages.email)
   
    const url = await this.azureBlobService.uploadFile(file,id);
    return {imageId: url.uniqueId, id: url.id };
  }
 

async find (email:string){
  console.log("email",email)
const auth=await this.AuthRepo.findOne({ where: { email:email } })
if(auth==null){
throw new BadRequestException("email is invaild")
}
console.log("auth",auth.id)
  return auth.id ;
}


}
