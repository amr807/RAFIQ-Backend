import { Controller, Post, Body, BadRequestException, Res } from '@nestjs/common';
import { CreateAzureStorgeDownloadDto } from './dto/create-azure-storge-download.dto';
import { AzureBlobService } from 'src/azure-storage/azure-storage.service';
import { findIdByEmail } from 'src/db_fuction/find_id';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';
import { Repository } from 'typeorm';

@Controller('azure-storge-download')
export class AzureStorgeDownloadController {
  constructor(private readonly azureBlobService: AzureBlobService,@InjectRepository(Auth,'auth_db')   private  AuthRepo:Repository<Auth>) {}

  @Post()
  async saveimage(@Body() createAzureStorgeDownloadDto: CreateAzureStorgeDownloadDto,@Res({passthrough: true }) res: Response) {
    const id=await findIdByEmail(createAzureStorgeDownloadDto.email,this.AuthRepo)
    
   
    return this.azureBlobService.downloadFile(id, res);
  }


 
 async find (email:string){
 const auth=await this.AuthRepo.findOne({ where: { email:email } })
 if(auth==null){
 throw new BadRequestException("email is invaild")
 }
   return auth.id ;
 }
 
}
