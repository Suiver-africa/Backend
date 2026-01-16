import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import Web3 from 'web3';

import { ECPairFactory } from 'ecpair';
// Initialize bitcoinjs-lib with ecc
bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

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

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly solanaConnection: Connection;
  private readonly web3: Web3;

  constructor(private configService: ConfigService) {
    this.solanaConnection = new Connection(
      this.configService.get('SOLANA_RPC_URL') || 'https://api.mainnet-beta.solana.com'
    );
    this.web3 = new Web3(this.configService.get('ETH_RPC_URL') || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
  }

  // Get real-time crypto prices
  async getCryptoPrices(): Promise<CryptoPrice[]> {
    try {
      const symbols = ['BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'BNB', 'SUI', 'APT'];
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,solana,binancecoin,sui,aptos&vs_currencies=usd&include_24hr_change=true`
      );

      const data = await response.json();
      const usdToNgn = await this.getUSDToNGNRate();

      return [
        {
          symbol: 'BTC',
          priceUSD: data.bitcoin.usd,
          priceNGN: data.bitcoin.usd * usdToNgn,
          change24h: data.bitcoin.usd_24h_change || 0
        },
        {
          symbol: 'ETH',
          priceUSD: data.ethereum.usd,
          priceNGN: data.ethereum.usd * usdToNgn,
          change24h: data.ethereum.usd_24h_change || 0
        },
        {
          symbol: 'USDT',
          priceUSD: data.tether.usd,
          priceNGN: data.tether.usd * usdToNgn,
          change24h: data.tether.usd_24h_change || 0
        },
        {
          symbol: 'SOL',
          priceUSD: data.solana.usd,
          priceNGN: data.solana.usd * usdToNgn,
          change24h: data.solana.usd_24h_change || 0
        }
        // Add other cryptocurrencies...
      ];
    } catch (error) {
      this.logger.error('Failed to fetch crypto prices:', error);
      throw new Error('Unable to fetch crypto prices');
    }
  }

  // Get USD to NGN exchange rate
  private async getUSDToNGNRate(): Promise<number> {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      return data.rates.NGN || 1600; // Fallback rate
    } catch (error) {
      this.logger.warn('Failed to fetch USD/NGN rate, using fallback');
      return 1600; // Fallback rate
    }
  }

  // Generate wallet for different cryptocurrencies
  async generateWallet(cryptocurrency: string): Promise<{ address: string; privateKey: string; publicKey: string }> {
    switch (cryptocurrency.toLowerCase()) {
      case 'btc':
        return this.generateBitcoinWallet();
      case 'sol':
        return this.generateSolanaWallet();
      case 'eth':
      case 'usdt':
      case 'usdc':
      case 'bnb':
        return this.generateEthereumWallet();
      case 'sui':
        return this.generateSuiWallet();
      case 'apt':
      case 'aptos':
        return this.generateAptosWallet();
      default:
        throw new Error(`Unsupported cryptocurrency: ${cryptocurrency}`);
    }
  }



  private generateBitcoinWallet() {
  // Generate random private key (32 bytes)
  const privateKey = Buffer.from(Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)));

  // Create key pair from private key
  const keyPair = ECPair.fromPrivateKey(privateKey);

  // Generate P2PKH (Pay to Public Key Hash) address - most common Bitcoin address format
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: bitcoin.networks.bitcoin // Use mainnet
  });

  return {
    address: address!,
    privateKey: keyPair.toWIF(), // Wallet Import Format
    publicKey: keyPair.publicKey.toString('hex')
  };
}



  private generateSolanaWallet() {
  const keypair = Keypair.generate();

  return {
    address: keypair.publicKey.toString(),
    privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    publicKey: keypair.publicKey.toString()
  };
}

  private generateEthereumWallet() {
  const account = this.web3.eth.accounts.create();

  return {
    address: account.address,
    privateKey: account.privateKey,
    publicKey: account.address // For Ethereum, address serves as public identifier
  };
}

  private generateSuiWallet() {
  // For SUI, we'll use a simple key generation approach
  // In production, you'd use the official SUI SDK
  const privateKey = Buffer.from(Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)));
  const privateKeyHex = '0x' + privateKey.toString('hex');

  // This is a simplified SUI address generation - use official SDK in production
  const address = '0x' + privateKey.slice(0, 20).toString('hex').padStart(40, '0');

  return {
    address,
    privateKey: privateKeyHex,
    publicKey: address
  };
}

  private generateAptosWallet() {
  // For Aptos, we'll use a simple key generation approach  
  // In production, you'd use the official Aptos SDK
  const privateKey = Buffer.from(Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)));
  const privateKeyHex = '0x' + privateKey.toString('hex');

  // This is a simplified Aptos address generation - use official SDK in production
  const address = '0x' + privateKey.slice(0, 32).toString('hex');

  return {
    address,
    privateKey: privateKeyHex,
    publicKey: address
  };
}

  // Get wallet balance
  async getWalletBalance(address: string, cryptocurrency: string): Promise < number > {
  try {
    switch(cryptocurrency.toLowerCase()) {
        case 'btc':
  return await this.getBitcoinBalance(address);
        case 'sol':
  return await this.getSolanaBalance(address);
        case 'eth':
  return await this.getEthereumBalance(address);
        case 'usdt':
        case 'usdc':
  return await this.getERC20Balance(address, cryptocurrency);
        case 'bnb':
  return await this.getBNBBalance(address);
        case 'sui':
  return await this.getSuiBalance(address);
        case 'apt':
        case 'aptos':
  return await this.getAptosBalance(address);
        default:
  return 0;
}
    } catch (error) {
  this.logger.error(`Failed to get balance for ${cryptocurrency}:`, error);
  return 0;
}
  }

  private async getBitcoinBalance(address: string): Promise < number > {
  // Use a Bitcoin API service like BlockCypher or similar
  const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`);
  const data = await response.json();
  return data.balance / 100000000; // Convert satoshis to BTC
}

  private async getSolanaBalance(address: string): Promise < number > {
  const publicKey = new PublicKey(address);
  const balance = await this.solanaConnection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}

  private async getEthereumBalance(address: string): Promise < number > {
  const balanceWei = await this.web3.eth.getBalance(address);
  return parseFloat(this.web3.utils.fromWei(balanceWei, 'ether'));
}

  private async getERC20Balance(address: string, token: string): Promise < number > {
  // ERC20 token contract addresses
  const tokenContracts = {
    'usdt': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'usdc': '0xA0b86a33E6417e474d5f704f3c4C4d6c3a4fD78C'
  };

  const contractAddress = tokenContracts[token.toLowerCase()];
  if(!contractAddress) return 0;

  try {
    // ERC20 balanceOf ABI
    const abi = [{ "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" }];
    const contract = new this.web3.eth.Contract(abi, contractAddress);
    const balance = await contract.methods.balanceOf(address).call();

    // USDT and USDC have 6 decimals
    const bal = balance as any; 
    return parseInt(bal ? bal.toString() : '0') / Math.pow(10, 6);
  } catch(error) {
    this.logger.error(`Failed to get ${token} balance:`, error);
    return 0;
  }
}

  private async getBNBBalance(address: string): Promise < number > {
  try {
    // Use BSC RPC endpoint
    const bscWeb3 = new Web3(this.configService.get('BSC_RPC_URL') || 'https://bsc-dataseed1.binance.org/');
    const balanceWei = await bscWeb3.eth.getBalance(address);
    return parseFloat(bscWeb3.utils.fromWei(balanceWei, 'ether'));
  } catch(error) {
    this.logger.error('Failed to get BNB balance:', error);
    return 0;
  }
}

  private async getSuiBalance(address: string): Promise < number > {
  try {
    // Use SUI RPC endpoint
    const response = await fetch(this.configService.get('SUI_RPC_URL') || 'https://fullnode.mainnet.sui.io:443', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'suix_getBalance',
        params: [address, '0x2::sui::SUI']
      })
    });

    const data = await response.json();
    return data.result ? parseInt(data.result.totalBalance) / Math.pow(10, 9) : 0;
  } catch(error) {
    this.logger.error('Failed to get SUI balance:', error);
    return 0;
  }
}

  private async getAptosBalance(address: string): Promise < number > {
  try {
    // Use Aptos RPC endpoint
    const response = await fetch(`${this.configService.get('APTOS_RPC_URL') || 'https://fullnode.mainnet.aptoslabs.com/v1'}/accounts/${address}/resource/0x1::coin::CoinStore%3C0x1::aptos_coin::AptosCoin%3E`);
    const data = await response.json();
    return data.data ? parseInt(data.data.coin.value) / Math.pow(10, 8) : 0;
  } catch(error) {
    this.logger.error('Failed to get Aptos balance:', error);
    return 0;
  }
}

  // Convert crypto to Naira
  async convertCryptoToNaira(amount: number, cryptocurrency: string): Promise < { nairaAmount: number; exchangeRate: number } > {
  const prices = await this.getCryptoPrices();
  const cryptoPrice = prices.find(p => p.symbol.toLowerCase() === cryptocurrency.toLowerCase());

  if(!cryptoPrice) {
    throw new Error(`Price not found for ${cryptocurrency}`);
  }

    const nairaAmount = amount * cryptoPrice.priceNGN;
  return {
    nairaAmount: Math.round(nairaAmount * 100) / 100, // Round to 2 decimal places
    exchangeRate: cryptoPrice.priceNGN
  };
}
}
