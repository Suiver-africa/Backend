import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type TabName = "home" | "card" | "activity" | "settings";

const TAB_ITEMS: { name: TabName; label: string; icon: string; activeIcon: string }[] = [
  { name: "home",     label: "Home",     icon: "home-outline",       activeIcon: "home" },
  { name: "card",     label: "Card",     icon: "card-outline",       activeIcon: "card" },
  { name: "activity", label: "Activity", icon: "stats-chart-outline", activeIcon: "stats-chart" },
  { name: "settings", label: "Settings", icon: "settings-outline",   activeIcon: "settings" },
];

const Layout = () => {
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
                activeOpacity={0.7}
              >
                {/* Active Indicator Bar at the Top */}
                {focused && <View style={styles.activeIndicator} />}
                
                <View style={styles.tabIconWrap}>
                  <Ionicons
                    name={(focused ? tab.activeIcon : tab.icon) as any}
                    size={22}
                    color={focused ? "#FFFFFF" : "#B0A2C3"} 
                  />
                </View>
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
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
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#11051F", // Matches Home Black
    paddingTop: 0,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)", // Very subtle or no line
    height: Platform.OS === "ios" ? 90 : 75,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: '40%',
    height: 3,
    backgroundColor: "#A78BFA", // Lavender accent
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  tabIconWrap: {
    width: 40,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: "#B0A2C3", // Muted for inactive
    fontFamily: "Montserrat-Medium",
    fontWeight: "600",
  },
  tabLabelActive: {
    color: "#FFFFFF", // White for active
    fontWeight: "700",
  },
});

export default Layout;