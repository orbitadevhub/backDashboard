// supabase.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseError } from "./supabase.types";
import { createSupabaseClient } from "../config/supabase.config";

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient = createSupabaseClient();
  private readonly logger = new Logger(SupabaseService.name);

  constructor() {
    this.logger.log("Supabase client initialized");
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
        this.logger.error("Max retries reached", error);
        throw new SupabaseError("Operation failed after retries", error);
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
    contentType: string
  ) {
    return this.retry(async () => {
      this.logger.log(`Uploading file: ${fileName}`);

      const { error } = await this.client.storage
        .from(bucket)
        .upload(fileName, buffer, { contentType });

      if (error) {
        this.logger.error("Upload failed", error);
        throw error;
      }

      this.logger.log(`Upload successful: ${fileName}`);

      return { fileName };
    });
  }

  async getSignedUrl(bucket: string, path: string, expiresIn = 60) {
    return this.retry(async () => {
      const { data, error } = await this.client.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        this.logger.error("Signed URL error", error);
        throw error;
      }

      return data;
    });
  }
}