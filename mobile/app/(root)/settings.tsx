import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography } from '@/theme/tokens';

const rows = [
  'Manage crypto assets',
  'Auto-convert deposits',
  'Bank accounts',
  'Biometric login',
  'PIN management',
  'Active sessions',
  'Notification preferences',
  'Referrals',
  'Support (WhatsApp)',
  'Legal',
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>SO</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Samuel Okafor</Text>
            <Text style={styles.handle}>@samuel</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>KYC VERIFIED</Text></View>
          </View>
        </View>

        {rows.map((row) => (
          <TouchableOpacity key={row} style={styles.row} activeOpacity={0.82}>
            <Text style={styles.rowText}>{row}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.row, { borderColor: colors.red }]}>
          <Text style={[styles.rowText, { color: '#FF8B8B' }]}>Logout</Text>
          <Text style={[styles.chevron, { color: '#FF8B8B' }]}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { ...typography.screenTitle, color: colors.white, marginBottom: 14 },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  avatarText: { color: colors.white, fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  name: { color: colors.white, fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  handle: { color: colors.textSecondary, fontFamily: 'Montserrat-Regular', fontSize: 12, marginTop: 2 },
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#0F3C31',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: '#8AF2D1', fontFamily: 'Montserrat-SemiBold', fontSize: 10 },
  row: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowText: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 14 },
  chevron: { color: colors.textMuted, fontSize: 24, marginTop: -2 },
});
