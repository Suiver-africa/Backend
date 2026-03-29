import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { depositAssets, type DepositAsset } from '@/lib/mock-data';

const AUTH_TOKEN_KEY = 'auth_token';

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
  SOL: 'solana',
  SUI: 'sui',
  BNB: 'binancecoin',
  LTC: 'litecoin',
  BASE: 'ethereum',
};

export function getApiBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
}

async function getAuthHeaders() {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  if (!token) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getApiBaseUrl()}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function fetchLiveRates(symbols: string[]) {
  const ids = symbols
    .map((symbol) => COINGECKO_IDS[symbol])
    .filter(Boolean)
    .join(',');

  if (!ids) return {} as Record<string, number>;

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=ngn`,
  );
  if (!res.ok) {
    throw new Error('Failed to fetch live rates');
  }

  const payload = (await res.json()) as Record<string, { ngn: number }>;
  const rates: Record<string, number> = {};

  symbols.forEach((symbol) => {
    const id = COINGECKO_IDS[symbol];
    const rate = payload[id]?.ngn;
    if (typeof rate === 'number') rates[symbol] = rate;
  });

  return rates;
}

export async function getDepositAssetsWithRates(): Promise<DepositAsset[]> {
  try {
    const symbols = depositAssets.map((asset) => asset.symbol);
    const liveRates = await fetchLiveRates(symbols);

    return depositAssets.map((asset) => ({
      ...asset,
      rateNgn: Math.round(liveRates[asset.symbol] || Number(asset.rateNgn.replace(/,/g, '')))
        .toLocaleString('en-NG'),
    }));
  } catch {
    return depositAssets;
  }
}
