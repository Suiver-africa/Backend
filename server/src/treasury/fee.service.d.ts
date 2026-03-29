export declare class FeeService {
    private readonly feeRates;
    private readonly utilityFeeNgn;
    getFee(type: string, amount: number): number;
    getUtilityFee(): number;
}
