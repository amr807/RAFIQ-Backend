import { Module } from '@nestjs/common';
import { UploadController } from './uplodimagesManger.controller';
import { AzureBlobService } from 'src/azure-storage/azure-storage.service';
import { AzureBlobModule } from 'src/azure-storage/azura-blob.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';

@Module({
  imports: [AzureBlobModule,
    
    process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Auth])
  : TypeOrmModule.forFeature([Auth], 'auth_db')

],
controllers: [UploadController],
  })
export class UplodimagesModule {}
