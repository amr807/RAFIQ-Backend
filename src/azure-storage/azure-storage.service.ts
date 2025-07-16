import {
    BlobServiceClient,
    StorageSharedKeyCredential,
  } from '@azure/storage-blob';
  import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
  
  @Injectable()
  export class AzureBlobService {
    private blobServiceClient: BlobServiceClient;
    private containerName: string;
  
    constructor() {
      const account =process.env.AZURE_STORAGE_ACCOUNT_NAME ; 
      const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
      this.containerName =process.env.AZURE_STORAGE_CONTAINER_NAME;
  
      const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
  
      this.blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential,
      );
    }
  async downloadFile(blobid, res: any) {
    try{  

        const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        const blobClient = containerClient.getBlockBlobClient(blobid);
        const downloadBlockBlobResponse = await blobClient.download();
         const type=     downloadBlockBlobResponse.contentType.split("image/").join("")?.split("application/").join("")

         const contentType = downloadBlockBlobResponse.contentType  
         const buffer = await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
         res.set({
          'Content-Type': "image/png",
          'Content-Disposition': `inline; filename="${blobid}"`,
        });
           return new StreamableFile(buffer);
      }
      catch(er){
throw new NotFoundException("image not found")
      }
        }
     
     
  
    async uploadFile(file: Express.Multer.File, uniqueId: string) {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobClient = containerClient.getBlockBlobClient(file.originalname);

      const blobName = `${uniqueId}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

       await  blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });   
       const blobProperties = await blockBlobClient.getProperties();

      const id=blobProperties.contentType
  
      return { uniqueId, id };
    }
  







    private async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
        return new Promise((resolve, reject) => {
          const chunks: Uint8Array[] = [];
          readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
          });
          readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
          });
          readableStream.on('error', reject);
        });
      }
      


}
  