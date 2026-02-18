import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SignUpProps {
  onBack: () => void;
  onSwitchForm: (formType: "signup" | "signin") => void;
}

type SignUpStep = "account" | "login";

const SignUp = ({ onBack, onSwitchForm }: SignUpProps) => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("account");
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [accountForm, setAccountForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    referralCode: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAccountForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!accountForm.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!accountForm.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!accountForm.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!loginForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!loginForm.password.trim()) {
      newErrors.password = "Password is required";
    } else if (loginForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (loginForm.password !== loginForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateAccountForm()) {
      setCurrentStep("login");
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep("account");
  };

  const handleSignUp = () => {
    if (validateLoginForm()) {
      const signupData = {
        ...accountForm,
        ...loginForm,
      };
      console.log("Sign up with:", signupData);
   
    }
  };

  const renderAccountForm = () => (
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
          Create Account
        </Text>
        <Text className="text-gray-600 font-montserrat-regular">
          Tell us about yourself
        </Text>
      </View>

      <View className="flex-row mb-6">
        <View className="flex-1 h-1 bg-black rounded mr-2" />
        <View className="flex-1 h-1 bg-gray-300 rounded" />
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-sm font-montserrat-medium text-gray-700 mb-2">
            First Name
          </Text>
          <TextInput
            className={`border rounded-xl px-4 py-3 font-montserrat-regular ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your first name"
            value={accountForm.firstName}
            onChangeText={(text) => {
              setAccountForm({ ...accountForm, firstName: text });
              if (errors.firstName) {
                setErrors({ ...errors, firstName: "" });
              }
            }}
          />
          {errors.firstName && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.firstName}
            </Text>
          )}
        </View>

        <View>
          <Text className="text-sm font-montserrat-medium text-gray-700 mb-2">
            Last Name
          </Text>
          <TextInput
            className={`border rounded-xl px-4 py-3 font-montserrat-regular ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your last name"
            value={accountForm.lastName}
            onChangeText={(text) => {
              setAccountForm({ ...accountForm, lastName: text });
              if (errors.lastName) {
                setErrors({ ...errors, lastName: "" });
              }
            }}
          />
          {errors.lastName && (
            <Text className="text-red-500 text-sm mt-1">{errors.lastName}</Text>
          )}
        </View>

        <View>
          <Text className="text-sm font-montserrat-medium text-gray-700 mb-2">
            Phone Number
          </Text>
          <TextInput
            className={`border rounded-xl px-4 py-3 font-montserrat-regular ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={accountForm.phoneNumber}
            onChangeText={(text) => {
              setAccountForm({ ...accountForm, phoneNumber: text });
              if (errors.phoneNumber) {
                setErrors({ ...errors, phoneNumber: "" });
              }
            }}
          />
          {errors.phoneNumber && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.phoneNumber}
            </Text>
          )}
        </View>

        <View>
          <Text className="text-sm font-montserrat-medium text-gray-700 mb-2">
            Referral Code (Optional)
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 font-montserrat-regular"
            placeholder="Enter referral code if you have one"
            value={accountForm.referralCode}
            onChangeText={(text) =>
              setAccountForm({ ...accountForm, referralCode: text })
            }
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-black py-4 rounded-full mb-4"
        onPress={goToNextStep}
      >
        <Text className="text-white font-montserrat-semibold text-lg text-center">
          Continue
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onSwitchForm("signin")}>
        <Text className="text-center text-gray-600 font-montserrat-regular">
          Already have an account?{" "}
          <Text className="text-black font-montserrat-semibold">Sign In</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderLoginForm = () => (
    <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={goToPreviousStep}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="ml-2 text-lg font-montserrat-semibold">Back</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-montserrat-bold text-black mb-2">
          Create Login Details
        </Text>
        <Text className="text-gray-600 font-montserrat-regular">
          Set up your login credentials
        </Text>
      </View>

     
      <View className="flex-row mb-6">
        <View className="flex-1 h-1 bg-black rounded mr-2" />
        <View className="flex-1 h-1 bg-black rounded" />
      </View>

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
            value={loginForm.email}
            onChangeText={(text) => {
              setLoginForm({ ...loginForm, email: text });
              if (errors.email) {
                setErrors({ ...errors, email: "" });
              }
            }}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
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
            placeholder="Create a password"
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
            <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
          )}
        </View>

        <View>
          <Text className="text-sm font-montserrat-medium text-gray-700 mb-2">
            Confirm Password
          </Text>
          <TextInput
            className={`border rounded-xl px-4 py-3 font-montserrat-regular ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Confirm your password"
            secureTextEntry
            value={loginForm.confirmPassword}
            onChangeText={(text) => {
              setLoginForm({ ...loginForm, confirmPassword: text });
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: "" });
              }
            }}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="bg-black py-4 rounded-full mb-4"
        onPress={handleSignUp}
      >
        <Text className="text-white font-montserrat-semibold text-lg text-center">
          Create Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onSwitchForm("signin")}>
        <Text className="text-center text-gray-600 font-montserrat-regular">
          Already have an account?{" "}
          <Text className="text-black font-montserrat-semibold">Sign In</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View className="flex-1 w-full">
      {currentStep === "account" ? renderAccountForm() : renderLoginForm()}
    </View>
  );
};

export default SignUp;
