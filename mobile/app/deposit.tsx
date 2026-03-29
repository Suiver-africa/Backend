import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography } from '@/theme/tokens';
import { depositAssets } from '@/lib/mock-data';

export default function DepositScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return depositAssets;
    return depositAssets.filter(
      (asset) => asset.name.toLowerCase().includes(q) || asset.symbol.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Deposit</Text>
          <View style={styles.back} />
        </View>

        <Text style={styles.subtitle}>Choose the crypto you want to deposit</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search BTC, USDT, SOL..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
          {filtered.map((asset) => (
            <TouchableOpacity
              key={asset.id}
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: '/deposit-address',
                  params: { asset: asset.symbol, networks: asset.networks.join(',') },
                })
              }
            >
              <View style={styles.icon}>
                <Text style={styles.iconText}>{asset.symbol.slice(0, 1)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{asset.symbol}</Text>
                <Text style={styles.network}>{asset.networks.join(' / ')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 8, marginBottom: 14 },
  searchWrap: {
    height: 46,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: { flex: 1, color: colors.white, fontFamily: 'Montserrat-Regular', fontSize: 14 },
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { color: colors.white, fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  name: { color: colors.white, fontFamily: 'Montserrat-SemiBold', fontSize: 14 },
  network: { color: colors.textSecondary, fontFamily: 'Montserrat-Regular', fontSize: 12, marginTop: 2 },
});
