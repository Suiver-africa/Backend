import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressButton from "@/components/OnboardingButton";
import FloatingBubble from "@/components/FloatingBubble";
import { bubbleConfig } from "@/constants/BubbleConfig";
import { OnboardingData } from "@/constants/onboarding";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Welcome = () => {
  const [page, setPage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter()

  const handleNext = () => {
    if (page < OnboardingData.length - 1) {
      animateTransition(page + 1);
    } else {
      router.replace("/(auth)/welcomeScreen")
    }
  };

  const animateTransition = (nextPage: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setPage(nextPage);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const currentOnboarding = OnboardingData[page];
  const currentBubbles = bubbleConfig[page] || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {page < OnboardingData.length - 1 && (
        <Pressable
          style={{ zIndex: 9999 }}
          className="absolute top-10 right-4 z-10 p-2"
          onPress={() => {
            animateTransition(OnboardingData.length - 1);
            console.log("Skip to last page");
          }}
        >
          <Text className="text-base text-gray-500 font-medium">Skip</Text>
        </Pressable>
      )}

      <View className="flex-1 px-6 pb-10 justify-between">
        {currentBubbles.map((config, index) => (
          <FloatingBubble key={`bubble-${page}-${index}`} {...config} />
        ))}

        <Animated.View
          className="flex-1 justify-center items-center pt-8 z-10"
          style={{ opacity: fadeAnim }}
        >
          <Image
            source={currentOnboarding.image}
            style={{
              width: SCREEN_WIDTH * 0.7,
              height: SCREEN_HEIGHT * 0.4,
              resizeMode: "contain",
            }}
          />

          <Text className="text-3xl font-bold font-poppins-bold text-gray-900 text-center mb-6 px-6">
            {currentOnboarding.title}
          </Text>

          <Text className="text-base  text-[#222121] font-poppins-medium text-center px-10 leading-6">
            {currentOnboarding.description}
          </Text>
        </Animated.View>

        <View className="flex-row justify-center items-center mt-10 z-10">
          <ProgressButton
            onPress={handleNext}
            currentStep={page + 1}
            totalSteps={OnboardingData.length}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
