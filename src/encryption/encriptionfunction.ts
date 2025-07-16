import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PinManager {
  private algorithm = process.env.ALGORITHM || 'aes-256-cbc';
  private key: Buffer;
  private iv: Buffer;

  constructor() {
    const key = process.env.ENCRYPTION_KEY;
    const iv = process.env.ENCRYPTION_IV;

    if (!key || !iv) {
      throw new Error('ENCRYPTION_KEY and ENCRYPTION_IV must be set in env');
    }

    this.key = Buffer.from(key, 'hex');
    this.iv = Buffer.from(iv, 'hex');
  }

  encrypt(text: string) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encrypted: string) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
