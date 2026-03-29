import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, typography } from '@/theme/tokens';

export default function FlightsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>Book Flights</Text>
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}><Text style={styles.tabTextActive}>One-way</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Round trip</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Multi-city</Text></TouchableOpacity>
        </View>
        <Text style={styles.label}>Origin (IATA)</Text>
        <TextInput style={styles.input} defaultValue="LOS" placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>Destination (IATA)</Text>
        <TextInput style={styles.input} defaultValue="ABV" placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>Departure Date</Text>
        <TextInput style={styles.input} defaultValue="2026-04-12" placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>Passengers</Text>
        <View style={styles.counterBox}><Text style={styles.counterText}>1 Adult • 0 Child • 0 Infant</Text></View>
        <Text style={styles.label}>Class</Text>
        <View style={styles.counterBox}><Text style={styles.counterText}>Economy</Text></View>
        <TouchableOpacity style={styles.searchBtn}><Text style={styles.searchBtnText}>Search Flights</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { ...typography.screenTitle, color: colors.white, marginBottom: 16 },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tab: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderColor: colors.teal },
  tabText: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12 },
  tabTextActive: { color: colors.white, fontFamily: 'Montserrat-SemiBold', fontSize: 12 },
  label: { color: colors.textSecondary, fontFamily: 'Montserrat-Medium', fontSize: 12, marginBottom: 6 },
  input: { height: 46, borderRadius: 12, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, color: colors.white, paddingHorizontal: 12, fontFamily: 'Courier', marginBottom: 12 },
  counterBox: { height: 46, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', paddingHorizontal: 12, marginBottom: 12 },
  counterText: { color: colors.white, fontFamily: 'Montserrat-Medium', fontSize: 13 },
  searchBtn: { marginTop: 10, height: 52, borderRadius: 12, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  searchBtnText: { color: '#07231A', fontFamily: 'Montserrat-SemiBold' },
});
