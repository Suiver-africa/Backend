import { Injectable } from '@nestjs/common';

@Injectable()
export class FeeService {
  private readonly feeRates: Record<string, number> = {
    swap: 0.015, // 1.5% default swap fee
  };

  private readonly utilityFeeNgn = 15; // ₦15 flat utility fee

  /**
   * Calculate a percentage-based fee.
   * @param type  Fee type key (e.g. 'swap')
   * @param amount  Base amount in NGN
   */
  getFee(type: string, amount: number): number {
    const rate = this.feeRates[type] ?? 0.015;
    return amount * rate;
  }

  /**
   * Return the flat utility/network fee in NGN.
   */
  getUtilityFee(): number {
    return this.utilityFeeNgn;
  }
}
