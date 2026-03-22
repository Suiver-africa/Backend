import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Splash from "../components/Splash-screen";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // Wait until both splash is done AND auth state has loaded
    if (!showSplash && !isLoading) {
      if (isLoggedIn) {
        // Already authenticated → go to Welcome Back Pin screen
        router.replace("/(auth)/welcomeBackPin");
      } else {
        // Not authenticated → go to onboarding
        router.replace("/(auth)/onboarding");
      }
    }
  }, [showSplash, isLoading, isLoggedIn]);

  if (showSplash) {
    return (
      <Splash
        onFinish={() => {
          setShowSplash(false);
        }}
      />
    );
  }

  return null;
};

export default Index;