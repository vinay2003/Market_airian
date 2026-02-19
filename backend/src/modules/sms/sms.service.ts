import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
    private apiKey: string;
    private readonly logger = new Logger(SmsService.name);

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('FAST2SMS_API_KEY') || '';

        if (!this.apiKey) {
            this.logger.warn('FAST2SMS_API_KEY not found. SMS service will be mocked.');
        }
    }

    async sendOtp(phone: string, code: string): Promise<void> {
        if (!this.apiKey) {
            this.logger.log(`[MOCK SMS] To: ${phone}, OTP: ${code}`);
            return;
        }

        try {
            // Fast2SMS Bulk V2 API
            const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                headers: {
                    authorization: this.apiKey,
                },
                params: {
                    variables_values: code,
                    route: 'otp',
                    numbers: phone,
                },
            });

            if (response.data.return) {
                this.logger.log(`SMS sent to ${phone}: ${JSON.stringify(response.data)}`);
            } else {
                this.logger.error(`Fast2SMS Error: ${JSON.stringify(response.data)}`);
                // Fallback log
                this.logger.log(`[FALLBACK MOCK] To: ${phone}, OTP: ${code}`);
            }
        } catch (error) {
            this.logger.error(`Failed to send SMS to ${phone}`, error.message);
            this.logger.log(`[FALLBACK MOCK] To: ${phone}, OTP: ${code}`);
        }
    }
}
