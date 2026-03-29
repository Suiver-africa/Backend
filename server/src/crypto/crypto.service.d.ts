import { ConfigService } from '@nestjs/config';
export interface CryptoPrice {
    symbol: string;
    priceUSD: number;
    priceNGN: number;
    change24h: number;
}
export interface WalletInfo {
    address: string;
    balance: number;
    cryptocurrency: string;
}
export declare class CryptoService {
    private configService;
    private readonly logger;
    private readonly solanaConnection;
    private readonly web3;
    constructor(configService: ConfigService);
    getCryptoPrices(): Promise<CryptoPrice[]>;
    private getUSDToNGNRate;
    generateWallet(cryptocurrency: string): Promise<{
        address: string;
        privateKey: string;
        publicKey: string;
    }>;
    private generateBitcoinWallet;
    private generateSolanaWallet;
    private generateEthereumWallet;
    private generateSuiWallet;
    private generateAptosWallet;
    getWalletBalance(address: string, cryptocurrency: string): Promise<number>;
    private getBitcoinBalance;
    private getSolanaBalance;
    private getEthereumBalance;
    private getERC20Balance;
    private getBNBBalance;
    private getSuiBalance;
    private getAptosBalance;
    convertCryptoToNaira(amount: number, cryptocurrency: string): Promise<{
        nairaAmount: number;
        exchangeRate: number;
    }>;
}
