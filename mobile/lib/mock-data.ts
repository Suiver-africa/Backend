export type DepositAsset = {
  id: string;
  symbol: string;
  name: string;
  networks: string[];
  rateNgn: string;
  icon: string;
};

export const depositAssets: DepositAsset[] = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', networks: ['Bitcoin Network'], rateNgn: '120,450', icon: 'logo-bitcoin' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', networks: ['ERC-20'], rateNgn: '210,000', icon: 'logo-ethereum' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', networks: ['TRC-20', 'ERC-20'], rateNgn: '45,000', icon: 'cash-outline' },
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', networks: ['ERC-20', 'BASE'], rateNgn: '44,920', icon: 'wallet-outline' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', networks: ['Solana'], rateNgn: '82,000', icon: 'planet-outline' },
  { id: 'sui', symbol: 'SUI', name: 'Sui', networks: ['Sui Network'], rateNgn: '30,300', icon: 'sparkles-outline' },
  { id: 'bnb', symbol: 'BNB', name: 'Binance Coin', networks: ['BEP-20'], rateNgn: '95,250', icon: 'diamond-outline' },
  { id: 'ltc', symbol: 'LTC', name: 'Litecoin', networks: ['Litecoin'], rateNgn: '36,180', icon: 'logo-bitcoin' },
  { id: 'base', symbol: 'BASE', name: 'Base L2', networks: ['Base'], rateNgn: '48,620', icon: 'layers-outline' },
];

export const sampleActivity = [
  { id: 'tx1', label: 'Sold 50 USDT', amount: '+₦78,419.20', status: 'completed', at: 'Mar 27, 10:14 AM' },
  { id: 'tx2', label: 'MTN Airtime ₦500', amount: '-₦500.00', status: 'completed', at: 'Mar 27, 9:02 AM' },
  { id: 'tx3', label: 'Lagos → Abuja', amount: '-₦124,000.00', status: 'pending', at: 'Mar 26, 5:41 PM' },
];
