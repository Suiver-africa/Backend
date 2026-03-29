import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class RateService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private cache;
    private readonly CACHE_DURATION;
    private readonly coinGeckoIds;
    private fallbackRates;
    constructor(httpService: HttpService, configService: ConfigService);
    getRate(currency: string): Promise<number>;
    getRates(currencies: string[]): Promise<Record<string, number>>;
    convertToNGN(amount: number, fromCurrency: string): Promise<number>;
    convertFromNGN(amount: number, toCurrency: string): Promise<number>;
    private fetchRateFromAPI;
    private fetchMultipleRatesFromAPI;
    private isCacheValid;
    clearCache(): void;
    getCacheStatus(): {
        currency: string;
        rate: number;
        age: number;
        valid: boolean;
    }[];
}
