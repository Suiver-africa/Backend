import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SignInProps {
  onBack: () => void;
  onSwitchForm: (formType: "signup" | "signin") => void;
}

const SignIn = ({ onBack, onSwitchForm }: SignInProps) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!loginForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!loginForm.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        console.log("Sign in with:", loginForm);
        // Add your signin API call here


      } catch (error) {
        console.error("Sign in error:", error);
        setErrors({ general: "Login failed. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password for:", loginForm.email);
    
  };

  return (
    <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="ml-2 text-lg font-montserrat-semibold">Back</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-montserrat-bold text-black mb-2">
          Welcome Back
        </Text>
        <Text className="text-gray-600 font-montserrat-regular">
          Sign in to your account
        </Text>
      </View>

     
      {errors.general && (
        <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <Text className="text-red-600 text-sm font-montserrat-regular">
            {errors.general}
          </Text>
        </View>
      )}

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-sm font-montserrat-medium text-gray-700 mb-2">
            Email
          </Text>
          <TextInput
            className={`border rounded-xl px-4 py-3 font-montserrat-regular ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={loginForm.email}
            onChangeText={(text) => {
              setLoginForm({ ...loginForm, email: text.trim() });
              if (errors.email) {
                setErrors({ ...errors, email: "" });
              }
            }}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1 font-montserrat-regular">
              {errors.email}
            </Text>
          )}
        </View>

        <View>
          <Text className="text-sm font-montserrat-medium text-gray-700 mb-2">
            Password
          </Text>
          <TextInput
            className={`border rounded-xl px-4 py-3 font-montserrat-regular ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your password"
            secureTextEntry
            value={loginForm.password}
            onChangeText={(text) => {
              setLoginForm({ ...loginForm, password: text });
              if (errors.password) {
                setErrors({ ...errors, password: "" });
              }
            }}
          />
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1 font-montserrat-regular">
              {errors.password}
            </Text>
          )}
        </View>
      </View>

      
      <TouchableOpacity className="mb-6" onPress={handleForgotPassword}>
        <Text className="text-right text-black font-montserrat-semibold">
          Forgot Password?
        </Text>
      </TouchableOpacity>

 
      <TouchableOpacity
        className={`py-4 rounded-full mb-4 ${
          isLoading ? "bg-gray-400" : "bg-black"
        }`}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <Text className="text-white font-montserrat-semibold text-lg text-center">
          {isLoading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => onSwitchForm("signup")}>
        <Text className="text-center text-gray-600 font-montserrat-regular">
          Don't have an account?{" "}
          <Text className="text-black font-montserrat-semibold">Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignIn;
