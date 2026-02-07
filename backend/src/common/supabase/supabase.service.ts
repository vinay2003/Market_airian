import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;
    private readonly logger = new Logger(SupabaseService.name);

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            this.configService.get<string>('SUPABASE_URL')!,
            this.configService.get<string>('SUPABASE_SECRET_KEY')!,
        );
    }

    async uploadFile(file: Express.Multer.File, bucket: string, path: string): Promise<string> {
        const { data, error } = await this.supabase.storage
            .from(bucket)
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (error) {
            this.logger.error(`Supabase upload failed: ${error.message}`);

            // Attempt to create bucket if it doesn't exist
            if (error.message.includes('not found') || error.message.includes('Bucket not found')) {
                this.logger.log(`Attempting to create bucket: ${bucket}`);
                const { error: createError } = await this.supabase.storage.createBucket(bucket, {
                    public: true,
                });

                if (!createError) {
                    this.logger.log(`Bucket ${bucket} created. Retrying upload...`);
                    // Retry upload once
                    const { error: retryError } = await this.supabase.storage
                        .from(bucket)
                        .upload(path, file.buffer, {
                            contentType: file.mimetype,
                            upsert: true,
                        });

                    if (!retryError) {
                        const { data: { publicUrl } } = this.supabase.storage
                            .from(bucket)
                            .getPublicUrl(path); // Use path here, as data might be undefined in retry block if I don't capture it. 
                        // Check retry data.
                        // Actually, let's just fall through to getPublicUrl if retry succeeds.
                        // But I need to return here or let it flow. 
                        return this.supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
                    }
                    this.logger.error(`Retry upload failed: ${retryError.message}`);
                } else {
                    this.logger.error(`Failed to create bucket: ${createError.message}`);
                }
            }

            throw new Error(`Upload failed: ${error.message}`);
        }

        const { data: { publicUrl } } = this.supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrl;
    }
}
