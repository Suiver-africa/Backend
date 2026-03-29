import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '@/theme/tokens';

const PAIRS = [
  { pair: 'USDT/NGN', price: '₦1,582.40', change: '+1.2%' },
  { pair: 'BTC/NGN', price: '₦122,400,100', change: '-0.8%' },
  { pair: 'ETH/NGN', price: '₦6,450,000', change: '+0.4%' },
  { pair: 'SOL/NGN', price: '₦276,500', change: '+3.6%' },
];

export default function RatesScreen() {
  const [fromAsset, setFromAsset] = useState('USDT');
  const [toAsset, setToAsset] = useState('BTC');

  const quote = useMemo(() => {
    if (fromAsset === 'USDT' && toAsset === 'BTC') return '0.00000642 BTC';
    if (fromAsset === 'USDT' && toAsset === 'ETH') return '0.000122 ETH';
    if (fromAsset === 'USDT' && toAsset === 'SOL') return '0.0148 SOL';
    return '0.97 USDT';
  }, [fromAsset, toAsset]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Swap & Rates</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>From</Text>
          <View style={styles.rowBetween}>
            {['USDT', 'BTC', 'ETH', 'SOL'].map((asset) => (
              <TouchableOpacity
                key={asset}
                style={[styles.assetChip, fromAsset === asset && styles.assetChipActive]}
                onPress={() => setFromAsset(asset)}
              >
                <Text style={styles.assetChipText}>{asset}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.cardLabel, { marginTop: 18 }]}>To</Text>
          <View style={styles.rowBetween}>
            {['BTC', 'ETH', 'SOL', 'USDT'].map((asset) => (
              <TouchableOpacity
                key={asset}
                style={[styles.assetChip, toAsset === asset && styles.assetChipActive]}
                onPress={() => setToAsset(asset)}
              >
                <Text style={styles.assetChipText}>{asset}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.quoteBox}>
            <Text style={styles.quoteLabel}>Estimated receive</Text>
            <Text style={styles.quoteValue}>{quote}</Text>
          </View>

          <TouchableOpacity style={styles.cta}>
            <Text style={styles.ctaText}>Review Swap</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Live Market Rates</Text>
        {PAIRS.map((item) => (
          <View key={item.pair} style={styles.rateRow}>
            <Text style={styles.pair}>{item.pair}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={[styles.change, item.change.startsWith('+') ? styles.up : styles.down]}>{item.change}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { ...typography.screenTitle, color: colors.textPrimary, marginBottom: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 18,
  },
  cardLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  assetChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assetChipActive: { borderColor: colors.teal },
  assetChipText: { color: colors.white, fontFamily: 'Montserrat-SemiBold', fontSize: 13 },
  quoteBox: {
    marginTop: 16,
    backgroundColor: '#112B26',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.teal,
    padding: 12,
  },
  quoteLabel: { ...typography.caption, color: '#89DEC7' },
  quoteValue: { color: colors.white, fontFamily: 'Poppins-SemiBold', fontSize: 18, marginTop: 4 },
  cta: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: { color: colors.background, fontFamily: 'Montserrat-SemiBold', fontSize: 14 },
  sectionTitle: { ...typography.sectionHeading, color: colors.textPrimary, marginBottom: 10 },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  pair: { color: colors.white, fontFamily: 'Montserrat-SemiBold', fontSize: 14 },
  price: { color: colors.textSecondary, fontFamily: 'Courier', fontSize: 13 },
  change: { fontFamily: 'Montserrat-SemiBold', fontSize: 12 },
  up: { color: colors.teal },
  down: { color: colors.red },
});
