import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface CoinGeckoResponse {
  [key: string]: {
    ngn: number;
    usd: number;
  };
}

interface RateCache {
  [key: string]: {
    rate: number;
    timestamp: number;
  };
}

@Injectable()
export class RateService {
  private readonly logger = new Logger(RateService.name);
  private cache: RateCache = {};
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  // Map crypto symbols to CoinGecko IDs
  private readonly coinGeckoIds: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    BNB: 'binancecoin',
    LTC: 'litecoin',
    SUI: 'sui',
    SOL: 'solana',
    USDT: 'tether',
    USDC: 'usd-coin',
    ADA: 'cardano',
    DOT: 'polkadot',
    MATIC: 'matic-network',
  };

  // Fallback rates in case API fails (NGN per unit)
  private fallbackRates: Record<string, number> = {
    BTC: 90000000,
    ETH: 6000000,
    BNB: 350000,
    LTC: 40000,
    SUI: 20,
    SOL: 4500,
    USDT: 1500,
    USDC: 1500,
    ADA: 800,
    DOT: 8000,
    MATIC: 800,
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get current exchange rate for a cryptocurrency in NGN
   */
  async getRate(currency: string): Promise<number> {
    const upperCurrency = currency.toUpperCase();

    // Check cache first
    if (this.isCacheValid(upperCurrency)) {
      this.logger.debug(`Using cached rate for ${upperCurrency}`);
      return this.cache[upperCurrency].rate;
    }

    try {
      // Fetch fresh rate from API
      const rate = await this.fetchRateFromAPI(upperCurrency);

      // Cache the result
      this.cache[upperCurrency] = {
        rate,
        timestamp: Date.now(),
      };

      this.logger.debug(`Fetched fresh rate for ${upperCurrency}: ${rate} NGN`);
      return rate;
    } catch (error) {
      this.logger.error(
        `Failed to fetch rate for ${upperCurrency}:`,
        error.message,
      );

      // Return cached rate if available, even if expired
      if (this.cache[upperCurrency]) {
        this.logger.warn(`Using expired cached rate for ${upperCurrency}`);
        return this.cache[upperCurrency].rate;
      }

      // Fall back to static rate
      const fallbackRate = this.fallbackRates[upperCurrency];
      if (fallbackRate) {
        this.logger.warn(
          `Using fallback rate for ${upperCurrency}: ${fallbackRate} NGN`,
        );
        return fallbackRate;
      }

      // If no fallback available, throw error
      throw new HttpException(
        `Unable to get rate for ${upperCurrency}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Get rates for multiple currencies at once
   */
  async getRates(currencies: string[]): Promise<Record<string, number>> {
    const rates: Record<string, number> = {};

    // Group currencies by whether they need fresh data or can use cache
    const uncachedCurrencies = currencies.filter(
      (c) => !this.isCacheValid(c.toUpperCase()),
    );
    const cachedCurrencies = currencies.filter((c) =>
      this.isCacheValid(c.toUpperCase()),
    );

    // Get cached rates
    for (const currency of cachedCurrencies) {
      const upperCurrency = currency.toUpperCase();
      rates[upperCurrency] = this.cache[upperCurrency].rate;
    }

    // Fetch uncached rates
    if (uncachedCurrencies.length > 0) {
      try {
        const freshRates =
          await this.fetchMultipleRatesFromAPI(uncachedCurrencies);
        Object.assign(rates, freshRates);
      } catch (error) {
        this.logger.error('Failed to fetch multiple rates:', error.message);

        // Fall back to individual rate fetching for uncached currencies
        for (const currency of uncachedCurrencies) {
          try {
            rates[currency.toUpperCase()] = await this.getRate(currency);
          } catch (err) {
            this.logger.error(
              `Failed to get rate for ${currency}:`,
              err.message,
            );
          }
        }
      }
    }

    return rates;
  }

  /**
   * Convert amount from crypto to NGN
   */
  async convertToNGN(amount: number, fromCurrency: string): Promise<number> {
    const rate = await this.getRate(fromCurrency);
    return amount * rate;
  }

  /**
   * Convert amount from NGN to crypto
   */
  async convertFromNGN(amount: number, toCurrency: string): Promise<number> {
    const rate = await this.getRate(toCurrency);
    return amount / rate;
  }

  /**
   * Fetch rate from CoinGecko API
   */
  private async fetchRateFromAPI(currency: string): Promise<number> {
    const coinGeckoId = this.coinGeckoIds[currency];
    if (!coinGeckoId) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const url = `https://api.coingecko.com/api/v3/simple/price`;
    const params = {
      ids: coinGeckoId,
      vs_currencies: 'ngn,usd',
      include_24hr_change: 'false',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get<CoinGeckoResponse>(url, {
          params,
          timeout: 10000, // 10 second timeout
        }),
      );

      const data = response.data;
      const coinData = data[coinGeckoId];

      if (!coinData) {
        throw new Error(`No data returned for ${currency}`);
      }

      // Prefer NGN rate, fall back to USD rate converted to NGN
      let rate = coinData.ngn;
      if (!rate && coinData.usd) {
        // If NGN rate not available, convert USD to NGN (approximate rate: 1 USD = 800 NGN)
        const usdToNgn = this.configService.get<number>('USD_TO_NGN_RATE', 800);
        rate = coinData.usd * usdToNgn;
        this.logger.warn(
          `NGN rate not available for ${currency}, using USD conversion`,
        );
      }

      if (!rate || rate <= 0) {
        throw new Error(`Invalid rate received for ${currency}: ${rate}`);
      }

      return rate;
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw error;
    }
  }

  /**
   * Fetch multiple rates in a single API call
   */
  private async fetchMultipleRatesFromAPI(
    currencies: string[],
  ): Promise<Record<string, number>> {
    const coinGeckoIds = currencies
      .map((c) => this.coinGeckoIds[c.toUpperCase()])
      .filter(Boolean);

    if (coinGeckoIds.length === 0) {
      throw new Error('No supported currencies provided');
    }

    const url = `https://api.coingecko.com/api/v3/simple/price`;
    const params = {
      ids: coinGeckoIds.join(','),
      vs_currencies: 'ngn,usd',
      include_24hr_change: 'false',
    };

    const response = await firstValueFrom(
      this.httpService.get<CoinGeckoResponse>(url, {
        params,
        timeout: 15000, // 15 second timeout for multiple currencies
      }),
    );

    const data = response.data;
    const rates: Record<string, number> = {};
    const usdToNgn = this.configService.get<number>('USD_TO_NGN_RATE', 800);

    for (const currency of currencies) {
      const upperCurrency = currency.toUpperCase();
      const coinGeckoId = this.coinGeckoIds[upperCurrency];
      const coinData = data[coinGeckoId];

      if (coinData) {
        const rate =
          coinData.ngn || (coinData.usd ? coinData.usd * usdToNgn : 0);
        if (rate > 0) {
          rates[upperCurrency] = rate;

          // Cache the result
          this.cache[upperCurrency] = {
            rate,
            timestamp: Date.now(),
          };
        }
      }
    }

    return rates;
  }

  /**
   * Check if cached rate is still valid
   */
  private isCacheValid(currency: string): boolean {
    const cached = this.cache[currency];
    if (!cached) return false;

    const age = Date.now() - cached.timestamp;
    return age < this.CACHE_DURATION;
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache = {};
    this.logger.log('Rate cache cleared');
  }

  /**
   * Get cache status for monitoring
   */
  getCacheStatus(): {
    currency: string;
    rate: number;
    age: number;
    valid: boolean;
  }[] {
    return Object.entries(this.cache).map(([currency, data]) => ({
      currency,
      rate: data.rate,
      age: Date.now() - data.timestamp,
      valid: this.isCacheValid(currency),
    }));
  }
}
