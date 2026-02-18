import { useState, useRef, useEffect } from "react";
import { View, Animated, Easing, Dimensions } from "react-native";

const FloatingBubble = ({
  color,
  size,
  delay,
  startX,
  startY,
}: BubbleProps) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");
  const animatedY = useRef(new Animated.Value(0)).current;
  const animatedX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const padding = 50;
    const maxX = SCREEN_WIDTH - size - padding;
    const maxY = SCREEN_HEIGHT - size - padding;
    const minX = padding;
    const minY = padding;

    const safeStartX = Math.max(minX, Math.min(startX, maxX));
    const safeStartY = Math.max(minY, Math.min(startY, maxY));
    const moveRangeX = 30;
    const moveRangeY = 40;

    Animated.timing(opacity, {
      toValue: 0.6,
      duration: 1000,
      delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();

    const createFloatingAnimation = () => {
      return Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(animatedY, {
              toValue: -moveRangeY,
              duration: 4000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(animatedY, {
              toValue: moveRangeY,
              duration: 4000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
          ]),
          Animated.sequence([
            Animated.timing(animatedX, {
              toValue: moveRangeX,
              duration: 5000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(animatedX, {
              toValue: -moveRangeX,
              duration: 5000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 3000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.quad),
            }),
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 3000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.quad),
            }),
          ]),
        ])
      );
    };

    const timer = setTimeout(() => {
      createFloatingAnimation().start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: color,
          backgroundColor: color + "20",
        },
        {
          opacity,
          transform: [{ translateX: animatedX }, { translateY: animatedY }],
        },
      ]}
    />
  );
};

export default FloatingBubble;