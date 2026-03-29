import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EvmListener } from './evm.listener';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ListenerService implements OnModuleInit {
  private readonly logger = new Logger(ListenerService.name);

  constructor(
    private readonly evmListener: EvmListener,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('Starting Blockchain Listeners...');
    // In a real app, we might want to start this based on a flag or async
    this.startListeners();
  }

  private startListeners() {
    // For MVP, we might only enable one
    this.evmListener.start('ETH');
  }
}
