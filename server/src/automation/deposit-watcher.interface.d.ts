export interface DepositEvent {
    address: string;
    txHash: string;
    amount: string;
    symbol: string;
    confirmations: number;
    chain: string;
}
export interface DepositWatcher {
    start(): Promise<void>;
    stop(): Promise<void>;
    onDeposit(cb: (evt: DepositEvent) => Promise<void>): void;
}
