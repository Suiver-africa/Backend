import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Splash = ({ onFinish }: { onFinish?: () => void }) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const logoScale = useRef(new Animated.Value(1.5)).current;
  const logoTranslateX = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;

  const finalLogoSize = Math.min(width, height) * 0.255;
  const initialLogoSize = Math.min(width, height) * 0.35;
  const fontSize = width * 0.1;
  const spacing = width * 0.02;

  const totalContentWidth = finalLogoSize + spacing + fontSize * 6;
  const logoFinalX = -totalContentWidth / 2 + finalLogoSize / 1;
  const textFinalX =
    -totalContentWidth / 2 + finalLogoSize + spacing + fontSize * 2.5;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(1500),

      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: finalLogoSize / initialLogoSize,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),

        Animated.timing(logoTranslateX, {
          toValue: logoFinalX,
          duration: 600,
          useNativeDriver: true,
        }),

        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          delay: 300,
          useNativeDriver: true,
        }),

        Animated.timing(textTranslateX, {
          toValue: textFinalX,
          duration: 600,
          delay: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 2000);
    });
  }, [width, height]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        <Animated.Image
          source={require("../assets/images/icon.png")}
          style={[
            styles.logo,
            {
              width: initialLogoSize,
              height: initialLogoSize,
              position: "absolute",
              transform: [
                { scale: logoScale },
                { translateX: logoTranslateX },
                { translateY: logoTranslateY },
              ],
            },
          ]}
          resizeMode="contain"
        />

        <Animated.Text
          style={[
            styles.text,
            {
              fontSize,
              position: "absolute",
              opacity: textOpacity,
              transform: [{ translateX: textTranslateX }],
            },
          ]}
        >
          Suiver
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    aspectRatio: 1,
  },
  text: {
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Monsterrat-bold",
  },
});

export default Splash;
