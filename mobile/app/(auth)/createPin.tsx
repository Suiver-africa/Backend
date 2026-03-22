import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PURPLE = "#5A3E76";

const CreatePin = () => {
  const [pin, setPin] = useState("");

  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          router.push({
            pathname: "/(auth)/verifyPin",
            params: { originalPin: newPin },
          });
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        {/* Top content */}
        <View style={styles.topSection}>

          {/* Avatar icon */}
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png" }}
            style={styles.avatar}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={styles.title}>Create pin</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            This will be used for login and transactions
          </Text>

          {/* PIN indicator boxes — 4 separate rounded boxes */}
          <View style={styles.pinRow}>
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <View key={index} style={styles.pinBox}>
                  {isFilled && <View style={styles.pinDot} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Numpad */}
        <View style={styles.numpad}>
          {/* Row 1 */}
          <View style={styles.numpadRow}>
            {["1", "2", "3"].map((n) => (
              <TouchableOpacity
                key={n}
                style={styles.numpadKey}
                onPress={() => handleNumberPress(n)}
                activeOpacity={0.6}
              >
                <Text style={styles.numpadText}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Row 2 */}
          <View style={styles.numpadRow}>
            {["4", "5", "6"].map((n) => (
              <TouchableOpacity
                key={n}
                style={styles.numpadKey}
                onPress={() => handleNumberPress(n)}
                activeOpacity={0.6}
              >
                <Text style={styles.numpadText}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Row 3 */}
          <View style={styles.numpadRow}>
            {["7", "8", "9"].map((n) => (
              <TouchableOpacity
                key={n}
                style={styles.numpadKey}
                onPress={() => handleNumberPress(n)}
                activeOpacity={0.6}
              >
                <Text style={styles.numpadText}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Row 4: empty, 0, delete */}
          <View style={styles.numpadRow}>
            {/* Empty slot */}
            <View style={styles.numpadKey} />

            {/* 0 */}
            <TouchableOpacity
              style={styles.numpadKey}
              onPress={() => handleNumberPress("0")}
              activeOpacity={0.6}
            >
              <Text style={styles.numpadText}>0</Text>
            </TouchableOpacity>

            {/* Delete — rounded rect with ⊗ matching image */}
            <TouchableOpacity
              style={styles.numpadKey}
              onPress={handleDelete}
              activeOpacity={0.6}
            >
              <View style={styles.deleteBox}>
                <Ionicons name="close" size={18} color="#000000" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    padding: 4,
  },
  topSection: {
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Montserrat-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginBottom: 32,
  },
  pinRow: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "center",
  },
  pinBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PURPLE,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    // iOS shadow
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000000",
  },
  numpad: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 24,
    gap: 0,
  },
  numpadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  numpadKey: {
    flex: 1,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  numpadText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Montserrat-Bold",
  },
  deleteBox: {
    width: 44,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default CreatePin;