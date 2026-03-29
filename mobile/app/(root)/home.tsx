import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography } from '@/theme/tokens';
import { depositAssets, sampleActivity } from '@/lib/mock-data';

export default function HomeScreen() {
  const [hideBalance, setHideBalance] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.profilePill}>
            <View style={styles.avatarMini}><Text style={styles.avatarMiniText}>S</Text></View>
            <Text style={styles.handle}>@suiveruser</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.balanceLabel}>Total Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>{hideBalance ? '••••••••' : '₦700,000.00'}</Text>
          <TouchableOpacity onPress={() => setHideBalance((v) => !v)}>
            <Ionicons name={hideBalance ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/deposit')}>
            <Text style={styles.primaryBtnText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(root)/card')}>
            <Text style={styles.secondaryBtnText}>Swap</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.notice}>
            <Ionicons name="notifications" size={14} color={colors.white} />
            <Text style={styles.noticeText} numberOfLines={1}>Rate alert: USDT hit ₦1,582.40</Text>
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/airtime')}>
              <View style={styles.gridIcon}><Ionicons name="phone-portrait-outline" size={20} color={colors.white} /></View>
              <Text style={styles.gridLabel}>Airtime</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/data')}>
              <View style={styles.gridIcon}><Ionicons name="wifi-outline" size={20} color={colors.white} /></View>
              <Text style={styles.gridLabel}>Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/tv-bills')}>
              <View style={styles.gridIcon}><Ionicons name="tv-outline" size={20} color={colors.white} /></View>
              <Text style={styles.gridLabel}>TV Bills</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/flights')}>
              <View style={styles.gridIcon}><Ionicons name="airplane-outline" size={20} color={colors.white} /></View>
              <Text style={styles.gridLabel}>Flights</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Assets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
            {depositAssets.slice(0, 4).map((asset) => (
              <TouchableOpacity key={asset.id} style={styles.assetChip} onPress={() => router.push('/deposit')}>
                <Text style={styles.assetChipText}>{asset.symbol} ₦{asset.rateNgn}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(root)/activity')}>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>

          {sampleActivity.map((item) => (
            <View key={item.id} style={styles.txRow}>
              <View>
                <Text style={styles.txLabel}>{item.label}</Text>
                <Text style={styles.txTime}>{item.at}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.txAmount, item.amount.startsWith('+') ? { color: colors.teal } : { color: colors.white }]}>{item.amount}</Text>
                <View style={[styles.statusChip, item.status === 'pending' ? styles.statusPending : styles.statusDone]}>
                  <Text style={styles.statusChipText}>{item.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  avatarMini: { width: 24, height: 24, borderRadius: 999, backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  avatarMiniText: { color: colors.white, fontFamily: 'Montserrat-Bold', fontSize: 11 },
  handle: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 12 },
  iconButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  balanceLabel: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6, marginBottom: 18 },
  balanceValue: { ...typography.balance, color: colors.white },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  primaryBtn: { flex: 1, height: 50, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: colors.background, fontFamily: 'Montserrat-SemiBold' },
  secondaryBtn: { flex: 1, height: 50, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: colors.white, fontFamily: 'Montserrat-SemiBold' },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  noticeText: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12, flex: 1 },
  sectionTitle: { ...typography.sectionHeading, color: colors.white, marginBottom: 10 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  gridItem: { alignItems: 'center', width: '24%' },
  gridIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  gridLabel: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 11 },
  assetChip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  assetChipText: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 12 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkText: { color: colors.primary, fontFamily: 'Montserrat-SemiBold', fontSize: 12 },
  txRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  txLabel: { color: colors.white, fontFamily: 'Montserrat-SemiBold', fontSize: 13 },
  txTime: { color: colors.textMuted, fontFamily: 'Montserrat-Regular', fontSize: 11, marginTop: 3 },
  txAmount: { fontFamily: 'Courier', fontSize: 13 },
  statusChip: { marginTop: 4, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  statusDone: { backgroundColor: '#0F3C31' },
  statusPending: { backgroundColor: '#523B14' },
  statusChipText: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 10, textTransform: 'capitalize' },
});
