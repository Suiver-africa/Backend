import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import "../app/global.css";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Monsterrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Monsterrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Monsterrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Monsterrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Monsterrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Monsterrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Monsterrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      console.log("Fonts loaded, hiding first splash in 1s");
      setTimeout(() => {
        SplashScreen.hideAsync();
        console.log("First splash hidden");
      }, 300);
    }
  }, [loaded]);

  if (!loaded) {
    console.log("Fonts not loaded yet");
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="deposit" options={{ headerShown: false }} />
          <Stack.Screen name="deposit-address" options={{ headerShown: false }} />
          <Stack.Screen name="airtime" options={{ headerShown: false }} />
          <Stack.Screen name="data" options={{ headerShown: false }} />
          <Stack.Screen name="tv-bills" options={{ headerShown: false }} />
          <Stack.Screen name="flights" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
