import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// ── Brand tokens ──
const DEEP   = "#1C0D2E";   // Top section deep plum background
const SHEET  = "#11051F";   // Curved sheet dark background
const CARD   = "#1A0A2E";   // Cards on sheet
const TEAL   = "#00E5A0";   // Growth / positive accept
const PURPLE = "#A78BFA";   // Lavender accent
const PALE   = "#EAE2EC";   // Alert capsule / Refer pill background (from current)
const WHITE  = "#FFFFFF";
const MUTED  = "#B0A2C3";   // Muted text on dark

const Home = () => {
  const [showBalance, setShowBalance] = useState(true);
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ─── TOP SECTION ─── */}
      <View style={styles.topContainer}>
        <SafeAreaView>
          {/* Header row */}
          <View style={styles.header}>
            <View style={styles.profileBox}>
              <View style={styles.profileIconCircle}>
                <Ionicons name="person" size={12} color={TEAL} />
              </View>
              <Text style={styles.profileTag}>@zen</Text>
            </View>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={20} color={MUTED} />
            </TouchableOpacity>
          </View>

          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.mainBalance}>
                {showBalance ? "₦700,000.00" : "••••••••"}
              </Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.eyeBtn}>
                <Ionicons
                  name={showBalance ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={PURPLE}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.growthTag}>+2.4% last 24h</Text>
          </View>

          {/* CTA Buttons */}
          <View style={styles.mainActions}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push("/deposit")}>
              <Ionicons name="add" size={20} color={DEEP} />
              <Text style={styles.btnPrimaryText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryText}>Transfer</Text>
              <Ionicons name="arrow-forward" size={16} color={WHITE} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* ─── DARK CURVED SHEET ─── */}
      <View style={styles.sheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.sheetHandle} />

          {/* ── Kept: Alert Pill (Pale) ── */}
          <View style={styles.alertPillWrapper}>
            <View style={styles.alertPill}>
              <Ionicons name="notifications" size={16} color="#000" />
              <Text style={styles.alertText} numberOfLines={1}>
                Your Solana just dropped, 1.05 Sol~(₦ 205,496..
              </Text>
            </View>
          </View>

          {/* ── Quick Actions Grid (Solid Circles) ── */}
          <View style={styles.gridSection}>
            {[
              { icon: "phone-portrait-outline", label: "Top-up" },
              { icon: "wifi-outline",           label: "Data" },
              { icon: "tv-outline",             label: "Cable" },
              { icon: "grid-outline",           label: "More" },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.actionItem}>
                <View style={styles.actionIconCircle}>
                  <Ionicons name={item.icon as any} size={24} color={WHITE} />
                </View>
                <Text style={styles.actionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>



          <Text style={styles.sectionTitle}>Featured Services</Text>

          {/* Old layout Banner style for Auto conversion */}
          <TouchableOpacity style={styles.detailedBanner} activeOpacity={0.82}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Auto conversion on deposits</Text>
              <Text style={styles.bannerSub}>Swap Crypto to Naira instantly.</Text>
            </View>
            <View style={styles.bannerIconArea}>
              <View style={styles.iconBg}>
                <Ionicons name="swap-horizontal" size={20} color={WHITE} />
              </View>
            </View>
          </TouchableOpacity>

          {/* ── Kept: Refer a friend pale pill banner ── */}
          <View style={{ marginTop: 24 }}>
            <TouchableOpacity style={styles.referBanner} activeOpacity={0.8}>
              <Image
                source={{ uri: "https://img.icons8.com/3d-fluency/94/gift.png" }} 
                style={styles.giftImage}
              />
              <Text style={styles.referText}>Refer a friend and earn</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DEEP },

  topContainer: {
    backgroundColor: DEEP,
    paddingBottom: 44,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 6,
    paddingRight: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  profileIconCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "rgba(0, 229, 160, 0.15)",
    alignItems: "center", justifyContent: "center",
    marginRight: 8,
  },
  profileTag: { color: WHITE, fontSize: 13, fontWeight: "600", fontFamily: "Montserrat-Medium" },
  headerIcon: {
    width: 44, height: 44,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },

  balanceSection: {
    alignItems: "center",
    marginTop: 35,
  },
  balanceLabel: { color: MUTED, fontSize: 13, fontWeight: "600", marginBottom: 8, fontFamily: "Montserrat-Medium" },
  balanceRow: { flexDirection: "row", alignItems: "center" },
  mainBalance: { color: WHITE, fontSize: 42, fontWeight: "800", letterSpacing: -0.5, fontFamily: "Montserrat-Bold" },
  eyeBtn: { marginLeft: 12, padding: 2 },
  growthTag: { color: TEAL, fontSize: 13, fontWeight: "700", marginTop: 8 },

  mainActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 35,
  },
  btnPrimary: {
    flex: 1, backgroundColor: WHITE, height: 52, borderRadius: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnPrimaryText: { color: DEEP, fontWeight: "800", fontSize: 15, fontFamily: "Montserrat-Bold" },
  btnSecondary: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.08)", height: 52, borderRadius: 14,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnSecondaryText: { color: WHITE, fontWeight: "700", fontSize: 15, fontFamily: "Montserrat-Medium" },

  sheet: {
    flex: 1,
    backgroundColor: SHEET,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -20,
  },
  sheetHandle: {
    width: 36, height: 4,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 2, alignSelf: "center",
    marginTop: 14, marginBottom: 20,
  },

  /* Pale Alert Pill */
  alertPillWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  alertPill: {
    backgroundColor: PALE,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  alertText: { color: "#333", fontSize: 13, fontWeight: "600", flex: 1, fontFamily: "Montserrat-Medium" },

  /* Action Grid (Solid dark circles like revert image) */
  gridSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionItem: { alignItems: "center", gap: 10 },
  actionIconCircle: {
    width: 66, height: 66,
    backgroundColor: "rgba(255,255,255,0.04)", // Slight highlight to separate from solid dark
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  actionLabel: { color: MUTED, fontSize: 12, fontWeight: "700", fontFamily: "Montserrat-Medium" },

  /* Pale Refer Banner */
  referBanner: {
    backgroundColor: PALE,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: "center",
    width: width - 40,
  },
  giftImage: { width: 44, height: 44, marginRight: 16 },
  referText: { color: "#111", fontSize: 16, fontWeight: "600", fontFamily: "Montserrat-Medium" },

  sectionTitle: {
    color: WHITE, fontSize: 18, fontWeight: "800",
    marginLeft: 20, marginTop: 32, marginBottom: 14, fontFamily: "Montserrat-Bold" 
  },

  detailedBanner: {
    backgroundColor: CARD,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1, borderColor: "rgba(167,139,250,0.1)",
  },
  bannerContent: { flex: 1 },
  bannerTitle: { color: WHITE, fontSize: 16, fontWeight: "800", marginBottom: 6, fontFamily: "Montserrat-Bold" },
  bannerSub: { color: MUTED, fontSize: 13, fontWeight: "500", fontFamily: "Montserrat-Regular" },
  bannerIconArea: { marginLeft: 12 },
  iconBg: {
    width: 48, height: 48,
    backgroundColor: "rgba(167,139,250,0.15)",
    borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(167,139,250,0.2)",
  },

});

export default Home;