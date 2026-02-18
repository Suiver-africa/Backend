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

      <View className="absolute top-20 w-full h-full  space-y-4">
        <View className="w-10 h-10 right-24 top-5 absolute ">
          <Image
            source={require("../assets/images/shield.png")}
            resizeMode="contain"
          />
        </View>
        <View className="w-10 h-10  absolute top-24 left-5 ml-6 ">
          <Image source={require("../assets/images/Solana.png")} />
        </View>
        <View className="w-10 h-10 absolute top-1/2 left-[40%] ">
          <Image
            source={require("../assets/images/Bitcoin.png")}
            resizeMode="contain"
          />
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
