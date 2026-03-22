import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const PURPLE = "#5A3E76";

const WelcomeBackPin = () => {
  const { savedPin, signOut } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === savedPin) {
          // ✅ Correct PIN → go to home
          setTimeout(() => {
            router.replace("/(root)/home");
          }, 200);
        } else {
          // ❌ Wrong PIN
          setError(true);
          shake();
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 1000);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleLogOut = () => {
    signOut();
    router.replace("/(auth)/onboarding");
  };

  const NUMPAD = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "del"],
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Log Out button top-right */}
        <TouchableOpacity onPress={handleLogOut} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        {/* Top section */}
        <View style={styles.topSection}>

          {/* Avatar */}
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png" }}
            style={styles.avatar}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={styles.title}>Welcome back</Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, error && styles.subtitleError]}>
            {error ? "Incorrect PIN, try again" : "Enter your pin"}
          </Text>

          {/* PIN Boxes */}
          <Animated.View
            style={[styles.pinRow, { transform: [{ translateX: shakeAnim }] }]}
          >
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <View
                  key={index}
                  style={[
                    styles.pinBox,
                    isFilled && styles.pinBoxFilled,
                    error && styles.pinBoxError,
                  ]}
                >
                  {isFilled && <View style={styles.pinDot} />}
                </View>
              );
            })}
          </Animated.View>
        </View>

        {/* Numpad */}
        <View style={styles.numpad}>
          {NUMPAD.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.numpadRow}>
              {row.map((key, keyIndex) => {
                if (key === "") {
                  return <View key={keyIndex} style={styles.numpadKey} />;
                }
                if (key === "del") {
                  return (
                    <TouchableOpacity
                      key={keyIndex}
                      style={styles.numpadKey}
                      onPress={handleDelete}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="backspace-outline" size={28} color="#1C0D2E" />
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    style={styles.numpadKey}
                    onPress={() => handleNumberPress(key)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.numpadText}>{key}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Forgot PIN */}
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot pin?</Text>
        </TouchableOpacity>

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
  logoutBtn: {
    alignSelf: "flex-end",
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C0D2E",
    fontFamily: "Montserrat-SemiBold",
  },
  topSection: {
    alignItems: "center",
    marginTop: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000000",
    fontFamily: "Montserrat-Bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginBottom: 36,
  },
  subtitleError: {
    color: "#EF4444",
  },
  pinRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  pinBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: PURPLE,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  pinBoxFilled: {
    backgroundColor: "#F5F0FF",
    borderColor: PURPLE,
  },
  pinBoxError: {
    borderColor: "#EF4444",
    backgroundColor: "#FFF5F5",
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: PURPLE,
  },
  numpad: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 16,
  },
  numpadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  numpadKey: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  numpadText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1C0D2E",
    fontFamily: "Montserrat-Bold",
  },
  forgotBtn: {
    alignItems: "center",
    paddingBottom: 32,
    paddingTop: 8,
  },
  forgotText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C0D2E",
    fontFamily: "Montserrat-Bold",
  },
});

export default WelcomeBackPin;
