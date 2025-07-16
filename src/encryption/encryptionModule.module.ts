// encryption/encryption.module.ts
import { Module } from '@nestjs/common';
import { PinManager } from './encriptionfunction';

@Module({
  providers: [PinManager],
  exports: [PinManager],
})
export class EncryptionModule {}
