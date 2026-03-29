import { ConfigService } from '@nestjs/config';
export declare class VTPassService {
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly publicKey;
    private readonly secretKey;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    purchaseAirtime(phone: string, amount: number, serviceID: string): Promise<any>;
    purchaseData(phone: string, amount: number, serviceID: string, variationCode: string): Promise<any>;
    private generateRequestId;
    queryStatus(requestId: string): Promise<any>;
}
