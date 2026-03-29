import { DepositWatcher, DepositEvent } from './deposit-watcher.interface';
export declare class MockDepositWatcherService implements DepositWatcher {
    private logger;
    private cb;
    private intervalRef;
    onDeposit(cb: (evt: DepositEvent) => Promise<void>): void;
    start(): Promise<void>;
    stop(): Promise<void>;
}
