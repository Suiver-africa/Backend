import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const VerifyOtp = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  const handleOtpChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(false);

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      setTimeout(() => {
        router.push("/(auth)/createPin");
      }, 500);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Verify your email</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Enter the code sent to{" "}
            <Text style={styles.emailBold}>
              {email || "zen***@gmail.com"}
            </Text>
          </Text>

          {/* OTP Boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <View
                key={index}
                style={[styles.otpBox, error && styles.otpBoxError]}
              >
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectionColor="#5A3E76"
                  autoFocus={index === 0}
                  caretHidden={false}
                />
              </View>
            ))}
          </View>

          {/* Error message */}
          {error && (
            <Text style={styles.errorText}>Invalid code. Please try again.</Text>
          )}

          {/* Resend Code */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>I did not receive the code </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.resendBold}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const PURPLE = "#5A3E76";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Montserrat-Bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "Montserrat-Regular",
  },
  emailBold: {
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Montserrat-Bold",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 32,
  },
  otpBox: {
    width: 68,
    height: 68,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PURPLE,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxError: {
    borderColor: "#EF4444",
  },
  otpInput: {
    width: "100%",
    height: "100%",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#000000",
    fontFamily: "Montserrat-Bold",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 12,
    fontFamily: "Montserrat-Regular",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  resendText: {
    color: "#6B7280",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  resendBold: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Montserrat-Bold",
  },
});

export default VerifyOtp;