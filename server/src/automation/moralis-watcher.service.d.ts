import { DepositWatcher, DepositEvent } from './deposit-watcher.interface';
import { ConfigService } from '@nestjs/config';
export declare class MoralisWatcherService implements DepositWatcher {
    private config;
    private logger;
    private cb;
    private interval;
    private lastSeen;
    private apiKey;
    constructor(config: ConfigService);
    onDeposit(cb: (evt: DepositEvent) => Promise<void>): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    poll(): Promise<void>;
}
