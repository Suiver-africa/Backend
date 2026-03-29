export interface OtcSellDto {
    amountCrypto: number;
    chain: string;
    payoutCurrency: string;
    payoutDetails: {
        account: string;
        bankCode: string;
    };
}
export interface OtcSellResult {
    id: string;
    paidAmount: number;
    status: string;
}
export declare class OtcService {
    private readonly logger;
    executeSell(dto: OtcSellDto): Promise<OtcSellResult>;
}
