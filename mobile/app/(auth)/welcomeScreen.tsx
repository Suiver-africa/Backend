import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Background from "@/components/GetStartedBackground";
import { SafeAreaView } from "react-native-safe-area-context";
import SignUp from "../(auth)/sign-up";
import SignIn from "../(auth)/sign-in";

type FormType = "welcome" | "signup" | "signin";

const WelcomeScreen = () => {
  const [currentForm, setCurrentForm] = useState<FormType>("welcome");

  const slideAnim = useRef(new Animated.Value(300)).current;

  const formSlideAnim = useRef(new Animated.Value(0)).current;
  const formOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const switchForm = (formType: FormType) => {
    Animated.parallel([
      Animated.timing(formSlideAnim, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentForm(formType);

      formSlideAnim.setValue(-100);
      formOpacityAnim.setValue(0);

      Animated.parallel([
        Animated.timing(formSlideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(formOpacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const renderWelcomeContent = () => (
    <View className="flex-1 justify-center items-center w-full">
      <TouchableOpacity
        className="bg-black w-4/5 py-4 rounded-full mb-6"
        onPress={() => switchForm("signup")}
      >
        <Text className="text-white font-montserrat-semibold text-lg text-center">
          Get Started
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => switchForm("signin")}>
        <Text className="text-lg font-montserrat-semibold text-black">
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAuthForm = () => {
    const commonProps = {
      onBack: () => switchForm("welcome"),
      onSwitchForm: (formType: "signup" | "signin") => switchForm(formType),
    };

    switch (currentForm) {
      case "signup":
        return <SignUp {...commonProps} />;
      case "signin":
        return <SignIn {...commonProps} />;
      default:
        return renderWelcomeContent();
    }
  };

  return (
    <Background>
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-between items-center px-5 pt-5"></View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="absolute left-0 bottom-0 w-full"
      >
        <Animated.View
          className="bg-white rounded-t-[50px] w-full p-8"
          style={{
            transform: [{ translateY: slideAnim }],

            minHeight: currentForm === "welcome" ? 220 : 500,
          }}
        >
          <Animated.View
            className="w-full"
            style={{
              transform: [{ translateY: formSlideAnim }],
              opacity: formOpacityAnim,
            }}
          >
            {renderAuthForm()}
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default WelcomeScreen;
