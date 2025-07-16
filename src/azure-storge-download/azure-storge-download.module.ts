import { Module } from '@nestjs/common';
import { AzureStorgeDownloadController } from './azure-storge-download.controller';
import { AzureBlobModule } from 'src/azure-storage/azura-blob.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/modules/manager';

@Module({
  imports: [AzureBlobModule,process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Auth])
  : TypeOrmModule.forFeature([Auth], 'auth_db')

],
  controllers: [AzureStorgeDownloadController],
})
export class AzureStorgeDownloadModule {}
