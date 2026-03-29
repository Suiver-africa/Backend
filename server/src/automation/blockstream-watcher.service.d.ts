import { DepositWatcher, DepositEvent } from './deposit-watcher.interface';
import { ConfigService } from '@nestjs/config';
export declare class BlockstreamWatcherService implements DepositWatcher {
    private config;
    private logger;
    private cb;
    private interval;
    private base;
    constructor(config: ConfigService);
    onDeposit(cb: (evt: DepositEvent) => Promise<void>): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    poll(): Promise<void>;
}
