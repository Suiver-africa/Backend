import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <LinearGradient
      colors={["#4A1F4A", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View className="flex-1 justify-center items-center mt-60">
        <View className="flex-row gap-0 items-center">
          <Image
            source={require("../assets/images/logo2.png")}
            className=" mr-2 "
            resizeMode="contain"
          />
          <Text className="text-[42px] font-montserrat-bold text-white">
            Suiver
          </Text>
        </View>
      </View>

      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default Background;
