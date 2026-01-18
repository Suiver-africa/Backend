import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class VTPassService {
    private readonly logger = new Logger(VTPassService.name);
    private readonly apiKey: string;
    private readonly publicKey: string;
    private readonly secretKey: string;
    private readonly baseUrl: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('VTPASS_API_KEY') || '';
        this.publicKey = this.configService.get<string>('VTPASS_PUBLIC_KEY') || '';
        this.secretKey = this.configService.get<string>('VTPASS_SECRET_KEY') || '';
        this.baseUrl = this.configService.get<string>('VTPASS_BASE_URL') || 'https://sandbox.vtpass.com/api';

        if (!this.apiKey || !this.publicKey) {
            this.logger.warn('VTPass credentials not fully configured');
        }
    }

    /**
     * Purchase Airtime
     * @param phone - Recipient phone number
     * @param amount - Amount in NGN
     * @param serviceID - Service ID (mtn, airtel, glo, etc.)
     */
    async purchaseAirtime(phone: string, amount: number, serviceID: string) {
        try {
            const requestId = this.generateRequestId();
            const payload = {
                request_id: requestId,
                serviceID: serviceID,
                amount: amount,
                phone: phone,
            };

            const response = await axios.post(`${this.baseUrl}/pay`, payload, {
                headers: {
                    'api-key': this.apiKey,
                    'public-key': this.publicKey,
                },
            });

            return response.data;
        } catch (error) {
            this.logger.error('VTPass Airtime purchase failed:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Purchase Data
     */
    async purchaseData(phone: string, amount: number, serviceID: string, variationCode: string) {
        try {
            const requestId = this.generateRequestId();
            const payload = {
                request_id: requestId,
                serviceID: serviceID,
                variation_code: variationCode,
                amount: amount,
                phone: phone,
            };

            const response = await axios.post(`${this.baseUrl}/pay`, payload, {
                headers: {
                    'api-key': this.apiKey,
                    'public-key': this.publicKey,
                },
            });

            return response.data;
        } catch (error) {
            this.logger.error('VTPass Data purchase failed:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Generate a unique request ID for VTPass (YYYYMMDDHHIISS + random string)
     */
    private generateRequestId(): string {
        const now = new Date();
        const dateStr = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
        const randomStr = Math.random().toString(36).substring(2, 6);
        return `${dateStr}${randomStr}`;
    }

    /**
     * Query Transaction Status
     */
    async queryStatus(requestId: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/query`, { request_id: requestId }, {
                headers: {
                    'api-key': this.apiKey,
                    'public-key': this.publicKey,
                },
            });
            return response.data;
        } catch (error) {
            this.logger.error('VTPass Status Query failed:', error.response?.data || error.message);
            throw error;
        }
    }
}
