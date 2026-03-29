import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, typography } from '@/theme/tokens';

const providers = ['DSTV', 'GOtv', 'Startimes'];

export default function TvBillsScreen() {
  const [provider, setProvider] = useState('DSTV');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.title}>Pay TV Bills</Text>
        <Text style={styles.label}>Provider</Text>
        <View style={styles.rowWrap}>{providers.map((p) => <TouchableOpacity key={p} style={[styles.chip, provider === p && styles.chipActive]} onPress={() => setProvider(p)}><Text style={styles.chipText}>{p}</Text></TouchableOpacity>)}</View>
        <Text style={styles.label}>Smart Card Number</Text>
        <TextInput style={styles.input} placeholder="Enter smart card number" placeholderTextColor={colors.textMuted} />
        <TouchableOpacity style={styles.verifyBtn}><Text style={styles.verifyBtnText}>Verify</Text></TouchableOpacity>
        <Text style={styles.label}>Package</Text>
        <View style={styles.planCard}><Text style={styles.planText}>{provider} Padi ₦2,500</Text></View>
        <View style={styles.planCard}><Text style={styles.planText}>{provider} Yanga ₦3,500</Text></View>
        <View style={styles.planCard}><Text style={styles.planText}>{provider} Confam ₦6,200</Text></View>
        <TouchableOpacity style={styles.payBtn}><Text style={styles.payBtnText}>Pay Bill</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { ...typography.screenTitle, color: colors.white, marginBottom: 16 },
  label: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12, marginBottom: 6 },
  rowWrap: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9 },
  chipActive: { borderColor: colors.teal },
  chipText: { color: colors.white, fontFamily: 'Montserrat-SemiBold', fontSize: 12 },
  input: { height: 46, borderRadius: 12, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, color: colors.white, paddingHorizontal: 12, fontFamily: 'Courier', marginBottom: 10 },
  verifyBtn: { borderRadius: 10, borderWidth: 1, borderColor: colors.teal, alignItems: 'center', paddingVertical: 10, marginBottom: 14 },
  verifyBtnText: { color: colors.teal, fontFamily: 'Montserrat-SemiBold' },
  planCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 8 },
  planText: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 13 },
  payBtn: { marginTop: 12, backgroundColor: colors.white, borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center' },
  payBtnText: { color: colors.background, fontFamily: 'Montserrat-SemiBold' },
});
