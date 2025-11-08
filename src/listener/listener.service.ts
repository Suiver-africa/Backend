// simplified
@Injectable()
export class ListenerService {
  constructor(private readonly depositQueue: Queue) {}

  async handleConfirmedTx(tx) {
    // find user wallet by address
    const wallet = await this.walletRepo.findByAddress(tx.to);
    if (!wallet) return;

    const expectedNgn = await this.priceService.cryptoToNgn(tx.amount, tx.chain);
    await this.depositRepo.create({
      userId: wallet.userId,
      chain: tx.chain,
      txHash: tx.hash,
      amountCrypto: tx.amount,
      amountNgnExpected: expectedNgn,
      status: 'PENDING'
    });

    // enqueue for processing
    await this.depositQueue.add('processDeposit', { txHash: tx.hash });
  }
}
