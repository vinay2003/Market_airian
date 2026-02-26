import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;
    private readonly logger = new Logger(SupabaseService.name);

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_SECRET_KEY');

        if (!supabaseUrl || !supabaseKey) {
            this.logger.error('Missing Supabase credentials in environment variables');
            throw new Error('Supabase configuration is incomplete');
        }

        try {
            this.supabase = createClient(supabaseUrl, supabaseKey, {
                auth: { persistSession: false },
                global: {
                    headers: { 'x-application-name': 'nest-backend' }
                }
            });
            this.logger.log('Supabase client initialized successfully');
        } catch (error) {
            this.logger.error(`Failed to initialize Supabase client: ${error.message}`);
            throw error;
        }
    }

    async uploadFile(file: Express.Multer.File, bucket: string, path: string): Promise<string> {
        if (!file || !file.buffer) {
            this.logger.error('Attempted to upload an empty file or missing buffer');
            throw new Error('Invalid file object provided for upload');
        }

        const maxRetries = 2;
        let attempt = 0;

        while (attempt < maxRetries) {
            attempt++;
            try {
                this.logger.debug(`Upload attempt ${attempt} for file ${path} to bucket ${bucket}`);

                const { data, error } = await this.supabase.storage
                    .from(bucket)
                    .upload(path, file.buffer, {
                        contentType: file.mimetype,
                        cacheControl: '3600',
                        upsert: true,
                    });

                if (error) {
                    // Handle specific bucket missing error
                    if (error.message.toLowerCase().includes('not found')) {
                        this.logger.warn(`Bucket '${bucket}' not found. Attempting creation...`);
                        await this.supabase.storage.createBucket(bucket, { public: true });
                        continue; // Retry after creating bucket
                    }
                    throw error;
                }

                if (!data?.path) {
                    throw new Error('Upload succeeded but no path returned');
                }

                const { data: { publicUrl } } = this.supabase.storage
                    .from(bucket)
                    .getPublicUrl(data.path);

                this.logger.log(`Successfully uploaded file to: ${publicUrl}`);
                return publicUrl;

            } catch (error: any) {
                this.logger.error(`Upload error on attempt ${attempt}:`, error?.stack || error);

                // Specific Check for fetch failures (DNS issues or offline project)
                if (error instanceof TypeError && error.message.includes('fetch failed')) {
                    this.logger.error('CRITICAL: Network Fetch Failed. Ensure Supabase project is active, not paused, and DNS resolves correctly.');
                }

                if (attempt >= maxRetries) {
                    throw new Error(`Failed to upload file after ${maxRetries} attempts: ${error.message || 'Unknown error'}`);
                }
                // Short wait before retry
                await new Promise(res => setTimeout(res, 1000 * attempt));
            }
        }
        throw new Error('Upload failed unexpectedly outside of retry loop');
    }
}
