import { Injectable } from '@nestjs/common';
import { FlutterwaveService } from './flutterwave.service';
import { OtcService } from './otc.service';
import { LedgerService } from './ledger.service';
import { TreasuryRepository } from './treasury.repository';
import { FeeService } from './fee.service';
import { NotificationService } from './notification.service';

@Injectable()
export class TreasuryService {
  constructor(
    private readonly flutterwave: FlutterwaveService,
    private readonly otc: OtcService,
    private readonly ledger: LedgerService,
    private readonly treasuryRepo: TreasuryRepository,
    private readonly feeService: FeeService,
    private readonly notificationService: NotificationService,
  ) {}

  async processDeposit(depositId: string) {
    const deposit = await this.treasuryRepo.findDepositById(depositId);
    if (!deposit) throw new Error('Missing deposit');

    // compute fee and net
    const swapFee = this.feeService.getFee('swap', deposit.amountNgnExpected); // 1-2%
    const netAmount = deposit.amountNgnExpected - swapFee;
    const utilityFee = this.feeService.getUtilityFee(); // ₦10-20

    const payoutAmount = netAmount - utilityFee;

    // check treasury balance
    const treasury = await this.treasuryRepo.get('NGN');

    // Primary path: try realtime transfer via Flutterwave
    if (treasury.availableBalance >= payoutAmount) {
      try {
        const recipient = await this.flutterwave.createRecipient({
          account_number: deposit.userBankAccount,
          bank_code: deposit.userBankCode,
          currency: 'NGN',
          name: deposit.userName,
        });
        const transfer = await this.flutterwave.initiateTransfer({
          recipient: recipient.id,
          amount: Math.ceil(payoutAmount), // NGN integer
          reason: `Suiver swap payout ${deposit.txHash}`,
        });

        // record ledger entries
        await this.ledger.record({
          depositId: deposit.id,
          debitAccount: 'TREASURY_NGN',
          creditAccount: `USER_${deposit.userId}`,
          amount: payoutAmount,
          metadata: {
            txHash: deposit.txHash,
            method: 'flutterwave',
            transferId: transfer.id,
          },
        });

        // update treasury
        await this.treasuryRepo.debit('NGN', payoutAmount);

        await this.treasuryRepo.updateDepositStatus(deposit.id, 'COMPLETED');
        return { method: 'flutterwave', transferId: transfer.id };
      } catch (err) {
        // realtime transfer failed — fallback to OTC
        console.warn(
          'Flutterwave transfer failed, fallback to OTC',
          err.message,
        );
      }
    }

    // Fallback path: use OTC desk (Transak OTC or local OTC partner)
    try {
      const otcResult = await this.otc.executeSell({
        amountCrypto: deposit.amountCrypto,
        chain: deposit.chain,
        payoutCurrency: 'NGN',
        payoutDetails: {
          account: deposit.userBankAccount,
          bankCode: deposit.userBankCode,
        },
      });

      // otcResult must return confirmation of payout settlement
      await this.ledger.record({
        depositId: deposit.id,
        debitAccount: 'TREASURY_NGN_OTC',
        creditAccount: `USER_${deposit.userId}`,
        amount: otcResult.paidAmount,
        metadata: { method: 'otc', otcId: otcResult.id },
      });

      await this.treasuryRepo.updateDepositStatus(deposit.id, 'COMPLETED');
      return { method: 'otc', otcId: otcResult.id };
    } catch (err) {
      // If OTC fails too: mark failed, create manual review
      await this.treasuryRepo.updateDepositStatus(deposit.id, 'FAILED');
      await this.notificationService.notifyAdmin(
        'Payout failed for deposit ' + deposit.id,
        err,
      );
      throw err;
    }
  }
}
