import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

type TabName = 'home' | 'card' | 'activity' | 'settings';

const TAB_ITEMS: { name: TabName; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'card', label: 'Rates', icon: 'swap-horizontal-outline', activeIcon: 'swap-horizontal' },
  { name: 'activity', label: 'Activity', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { name: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
];

export default function RootTabs() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <View style={styles.tabBar}>
          {TAB_ITEMS.map((tab, index) => {
            const focused = state.index === index;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => navigation.navigate(tab.name)}
                activeOpacity={0.8}
              >
                <Ionicons name={focused ? tab.activeIcon : tab.icon} size={20} color={focused ? colors.white : colors.textMuted} />
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="card" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 76,
    paddingBottom: Platform.OS === 'ios' ? 26 : 14,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  tabLabelActive: {
    color: colors.white,
  },
});
