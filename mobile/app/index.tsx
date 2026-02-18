import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Splash from "../components/Splash-screen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  console.log("Index rendering, showSplash:", showSplash);

  useEffect(() => {
    if (!showSplash) {
      console.log("Navigating to /welcome");
      router.replace("/onboarding");
    }
  }, [showSplash]);

  if (showSplash) {
    return (
      <Splash
        onFinish={() => {
          console.log("Custom splash finished");
          setShowSplash(false);
        }}
      />
    );
  }
  return null;
};

export default Index;