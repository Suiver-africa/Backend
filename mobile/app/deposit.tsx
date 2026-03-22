import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

// ── Brand tokens ──
const DEEP   = "#150823";   // Dark deep background
const CARD   = "#3B2B4A";   // The semi-transparent dark plum for cards (matches mockup)
const WHITE  = "#FFFFFF";
const MUTED  = "#A093AD";   // Muted text

const CRYPTO_LIST = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://img.icons8.com/color/96/bitcoin--v1.png",
  },
  {
    id: "bnb",
    name: "Binance Coin",
    symbol: "BNB",
    icon: "https://img.icons8.com/color/96/binance-logo.png",
  },
  {
    id: "ltc",
    name: "Litecoin",
    symbol: "LTC",
    icon: "https://img.icons8.com/color/96/litecoin.png",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    icon: "https://img.icons8.com/color/96/solana.png",
  },
  {
    id: "usdt",
    name: "Tether (USDT)",
    symbol: "USDT",
    icon: "https://img.icons8.com/color/96/tether--v1.png",
  },
];

const DepositScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header (Added for navigation so the user can go back) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Asset</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {CRYPTO_LIST.map((crypto, index) => (
            <TouchableOpacity key={crypto.id} style={styles.cryptoCard} activeOpacity={0.8}>
              <View style={styles.cardLeft}>
                <Image source={{ uri: crypto.icon }} style={styles.cryptoIcon} />
                <View style={styles.textContainer}>
                  <Text style={styles.cryptoName}>{crypto.name}</Text>
                  <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={MUTED} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DEEP },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Montserrat-Bold",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  cryptoCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD,
    borderRadius: 24, // Matching the pill shape of the mockup
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cryptoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    // Add subtle shadow to the icon to match the 3D pop effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  textContainer: {
    justifyContent: "center",
  },
  cryptoName: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Montserrat-Bold",
    marginBottom: 4,
  },
  cryptoSymbol: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Montserrat-Medium",
  },
});

export default DepositScreen;
