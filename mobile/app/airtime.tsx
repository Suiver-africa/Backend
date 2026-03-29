import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors, typography } from '@/theme/tokens';

const networks = ['MTN', 'Airtel', 'Glo', '9mobile'];
const amounts = ['₦100', '₦200', '₦500', '₦1,000'];

export default function AirtimeScreen() {
  const [network, setNetwork] = useState('MTN');
  const [amount, setAmount] = useState('₦500');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Buy Airtime</Text>
        <Text style={styles.label}>Network</Text>
        <View style={styles.rowWrap}>{networks.map((n) => <TouchableOpacity key={n} style={[styles.chip, network === n && styles.chipActive]} onPress={() => setNetwork(n)}><Text style={styles.chipText}>{n}</Text></TouchableOpacity>)}</View>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} defaultValue="08012345678" placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>Amount</Text>
        <View style={styles.rowWrap}>{amounts.map((n) => <TouchableOpacity key={n} style={[styles.chip, amount === n && styles.chipActive]} onPress={() => setAmount(n)}><Text style={styles.chipText}>{n}</Text></TouchableOpacity>)}</View>
        <View style={styles.preview}><Text style={styles.previewText}>{amount} airtime to 08012345678 via {network}</Text></View>
        <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Buy Now</Text></TouchableOpacity>
      </View>
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
  preview: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 16 },
  previewText: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12 },
  btn: { marginTop: 'auto', backgroundColor: colors.white, borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.background, fontFamily: 'Montserrat-SemiBold' },
});
