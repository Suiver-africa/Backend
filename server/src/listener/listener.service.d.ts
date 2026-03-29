import { OnModuleInit } from '@nestjs/common';
import { EvmListener } from './evm.listener';
import { ConfigService } from '@nestjs/config';
export declare class ListenerService implements OnModuleInit {
    private readonly evmListener;
    private readonly configService;
    private readonly logger;
    constructor(evmListener: EvmListener, configService: ConfigService);
    onModuleInit(): Promise<void>;
    private startListeners;
}
