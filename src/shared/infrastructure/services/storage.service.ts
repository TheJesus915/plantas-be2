import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  private readonly defaultBucket: string;
  private readonly maxFileSize: number;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.defaultBucket = process.env.SUPABASE_STORAGE_BUCKET!;
    this.maxFileSize = Number(process.env.SUPABASE_MAX_FILE_SIZE ?? 52428800);
  }

  async uploadFile(
    filePath: string,
    file: Buffer | Uint8Array,
    contentType = 'image/jpeg',
    bucket?: string
  ): Promise<{ url: string }> {
    const bucketToUse = bucket ?? this.defaultBucket;

    if (file.length > this.maxFileSize) {
      throw new Error(`File size exceeds the maximum limit of ${this.maxFileSize} bytes`);
    }

    const { data, error } = await this.supabase.storage
      .from(bucketToUse)
      .upload(filePath, file, { contentType, upsert: true });

    if (error) {
      throw new Error('Failed to upload file');
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(bucketToUse)
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl };
  }

  getPublicUrl(filePath: string, bucket?: string): string {
    const bucketToUse = bucket ?? this.defaultBucket;
    const { data } = this.supabase.storage.from(bucketToUse).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async deleteFile(filePath: string, bucket?: string): Promise<void> {
    const bucketToUse = bucket ?? this.defaultBucket;
    const { error } = await this.supabase.storage.from(bucketToUse).remove([filePath]);
    if (error) {
      throw new Error('Failed to delete file');
    }
  }
}