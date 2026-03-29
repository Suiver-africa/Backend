import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, typography } from '@/theme/tokens';

const networks = ['MTN', 'Airtel', 'Glo', '9mobile'];
const plans = ['MTN 1GB - ₦350 (30 days)', 'MTN 2GB - ₦600 (30 days)', 'MTN 5GB - ₦1,500 (30 days)'];

export default function DataScreen() {
  const [network, setNetwork] = useState('MTN');
  const [plan, setPlan] = useState(plans[0]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>Buy Data</Text>
        <Text style={styles.label}>Network</Text>
        <View style={styles.rowWrap}>{networks.map((n) => <TouchableOpacity key={n} style={[styles.chip, network === n && styles.chipActive]} onPress={() => setNetwork(n)}><Text style={styles.chipText}>{n}</Text></TouchableOpacity>)}</View>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} defaultValue="08012345678" placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>Bundle Plan</Text>
        {plans.map((p) => (
          <TouchableOpacity key={p} style={[styles.planCard, plan === p && styles.planCardActive]} onPress={() => setPlan(p)}>
            <Text style={styles.planText}>{p}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.preview}><Text style={styles.previewText}>{plan} to 08012345678</Text></View>
        <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Buy Now</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { ...typography.screenTitle, color: colors.white, marginBottom: 16 },
  label: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12, marginBottom: 6 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9 },
  chipActive: { borderColor: colors.teal },
  chipText: { color: colors.white, fontFamily: 'Montserrat-SemiBold', fontSize: 12 },
  input: { height: 46, borderRadius: 12, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, color: colors.white, paddingHorizontal: 12, fontFamily: 'Courier', marginBottom: 14 },
  planCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 8 },
  planCardActive: { borderColor: colors.primary },
  planText: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 13 },
  preview: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginTop: 10, marginBottom: 16 },
  previewText: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12 },
  btn: { backgroundColor: colors.white, borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.background, fontFamily: 'Montserrat-SemiBold' },
});
