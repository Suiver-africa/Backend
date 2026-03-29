import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, typography } from '@/theme/tokens';

const mockAddress = '1FfmbHfnpaZjKFvyi1okTjJJusN455paPH';

export default function DepositAddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ asset?: string; networks?: string }>();
  const [autoConvert, setAutoConvert] = useState(true);
  const [networkIndex, setNetworkIndex] = useState(0);

  const asset = (params.asset || 'BTC').toUpperCase();
  const networks = useMemo(
    () => (params.networks ? params.networks.split(',') : ['Bitcoin Network']),
    [params.networks],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>{asset}</Text>
          <View style={styles.back} />
        </View>

        <View style={styles.qrCard}>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrPlaceholderText}>QR: {asset}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.networkSelector}
          onPress={() => setNetworkIndex((prev) => (prev + 1) % networks.length)}
        >
          <Text style={styles.networkText}>{networks[networkIndex]} ▾</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Wallet Address</Text>
        <View style={styles.addressWrap}>
          <Text style={styles.addressText} numberOfLines={1}>
            {mockAddress}
          </Text>
          <TouchableOpacity>
            <Ionicons name="copy-outline" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.warning}>
          <Text style={styles.warningText}>
            Only send {asset} on {networks[networkIndex]}. Wrong network = lost funds.
          </Text>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Auto-convert when received</Text>
          <Switch
            value={autoConvert}
            onValueChange={setAutoConvert}
            trackColor={{ true: colors.teal, false: colors.border }}
          />
        </View>

        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareBtnText}>Share Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { ...typography.screenTitle, color: colors.white },
  qrCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    height: 220,
    marginBottom: 12,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholderText: {
    color: '#4A4660',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
  },
  networkSelector: {
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  networkText: { color: colors.white, fontFamily: 'Montserrat-Medium' },
  label: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12, marginBottom: 6 },
  addressWrap: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addressText: { color: colors.white, fontFamily: 'Courier', flex: 1, marginRight: 8 },
  warning: {
    backgroundColor: '#4A3316',
    borderColor: colors.amber,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  warningText: { color: '#FFD08A', fontFamily: 'Montserrat-Medium', fontSize: 12 },
  toggleRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  toggleLabel: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 13 },
  shareBtn: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtnText: { color: colors.background, fontFamily: 'Montserrat-SemiBold', fontSize: 14 },
});
