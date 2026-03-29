import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography } from '@/theme/tokens';
import { sampleActivity } from '@/lib/mock-data';

const FILTERS = ['All', 'Deposits', 'Swaps', 'Payouts', 'Bills', 'Flights'];

export default function ActivityScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Activity</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {sampleActivity.map((item) => (
            <TouchableOpacity key={item.id} style={styles.item} activeOpacity={0.85}>
              <View style={styles.iconWrap}>
                <Text style={styles.iconText}>{item.label.slice(0, 1)}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemDate}>{item.at}</Text>
              </View>
              <View style={styles.right}>
                <Text style={[styles.amount, item.amount.startsWith('+') ? styles.positive : styles.negative]}>{item.amount}</Text>
                <View style={[styles.statusPill, item.status === 'pending' ? styles.pending : styles.completed]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { ...typography.screenTitle, color: colors.white, marginBottom: 14 },
  filters: { gap: 8, paddingBottom: 14 },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: { borderColor: colors.primary, backgroundColor: colors.surfaceElevated },
  filterText: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12 },
  filterTextActive: { color: colors.white },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { color: colors.white, fontFamily: 'Montserrat-Bold' },
  details: { flex: 1, marginLeft: 10 },
  itemLabel: { color: colors.white, fontFamily: 'Montserrat-SemiBold', fontSize: 14 },
  itemDate: { color: colors.textMuted, fontFamily: 'Montserrat-Regular', fontSize: 11, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontFamily: 'Courier', fontSize: 13 },
  positive: { color: colors.teal },
  negative: { color: '#D1C4E9' },
  statusPill: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  completed: { backgroundColor: '#0F3C31' },
  pending: { backgroundColor: '#503812' },
  statusText: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 10, textTransform: 'capitalize' },
});
