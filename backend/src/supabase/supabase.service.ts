// supabase.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseError } from './supabase.types';
import { createSupabaseClient } from '../config/supabase.config';
import { FileEntity } from './entities/supabase.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm/repository/Repository';
import { randomUUID } from 'crypto';

@Injectable()
export class SupabaseService {
  @InjectRepository(FileEntity)
  private readonly fileRepo: Repository<FileEntity>;
  private readonly client: SupabaseClient = createSupabaseClient();
  private readonly logger = new Logger(SupabaseService.name);

  constructor() {
    this.logger.log('Supabase client initialized');
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  private async retry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 500
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) {
        this.logger.error('Max retries reached', error);
        throw new SupabaseError('Operation failed after retries', error);
      }

      this.logger.warn(`Retrying... attempts left: ${retries}`);

      await new Promise((res) => setTimeout(res, delay));

      return this.retry(fn, retries - 1, delay * 2);
    }
  }

  async uploadFile(
    bucket: string,
    fileName: string,
    buffer: Buffer,
    contentType: string,
    size: number,
    originalName: string,
    path?: string,
    destination?: string
  ) {
    return this.retry(async () => {
      const uniqueFileName = `uploads/${randomUUID()}-${fileName}`;

      this.logger.log(`Uploading file: ${uniqueFileName}`);

      const { error } = await this.client.storage
        .from(bucket)
        .upload(uniqueFileName, buffer, { contentType });

      if (error) {
        this.logger.error('Upload failed', error);
        throw error;
      }

      this.logger.log(`Upload successful: ${uniqueFileName}`);

      const sendData = await this.fileRepo.save({
        filename: originalName,
        mimetype: contentType,
        size,
        storagePath: uniqueFileName, 
        path: uniqueFileName, 
        destination,
      });

      return sendData;
    });
  }

  async getSignedUrl(bucket: string, path: string, expiresIn = 60) {
    return this.retry(async () => {
      const { data, error } = await this.client.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        this.logger.error('Signed URL error', error);
        throw error;
      }

      return data;
    });
  }
}
