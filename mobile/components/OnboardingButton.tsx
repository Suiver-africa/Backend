import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  currentStep: number;
  totalSteps?: number;
  onPress: () => void;
}

const ProgressButton = ({ currentStep, totalSteps = 4, onPress }: Props) => {
  const size = 90;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const gapSize = 11;
  const dashLength = circumference / totalSteps - gapSize;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const strokeColor = i < currentStep ? "#4A1F4A" : "#e0e0e0";

          return (
            <Circle
              key={i}
              stroke={strokeColor}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength},${circumference}`}
              strokeDashoffset={-(dashLength + gapSize) * i}
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
              strokeLinecap="round"
            />
          );
        })}
      </Svg>

      <View style={styles.iconContainer}>
        <Ionicons name="arrow-forward" size={40} color="black" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProgressButton;
