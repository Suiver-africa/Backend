import { Injectable, Logger } from '@nestjs/common';

export interface OtcSellDto {
    amountCrypto: number;
    chain: string;
    payoutCurrency: string;
    payoutDetails: { account: string; bankCode: string };
}

export interface OtcSellResult {
    id: string;
    paidAmount: number;
    status: string;
}

@Injectable()
export class OtcService {
    private readonly logger = new Logger(OtcService.name);

    /**
     * Execute a sell via the OTC desk.
     * Replace the stub body with your actual OTC provider integration
     * (e.g. Transak OTC, Yellow Card, etc.)
     */
    async executeSell(dto: OtcSellDto): Promise<OtcSellResult> {
        this.logger.log(`OTC sell requested: ${JSON.stringify(dto)}`);
        // TODO: integrate real OTC provider
        throw new Error('OTC provider not yet configured');
    }
}
