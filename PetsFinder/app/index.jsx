import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import "../global.css"
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
  const router = useRouter();

  // State for input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };
  const handleLogin = async () => {
    try {
  
  
      const response = await fetch("http://192.168.229.99:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
     
  
      const data = await response.json();

  
      if (response.ok) {
        
  
        // Save user data to AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(data));
  
        // Redirect to Pets Page
        router.push("./volunteer");
      } else {
      
        Alert.alert("Invalid Credentials", data?.message || "Please check your email and password.");
      }
    } catch (error) {
   
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  
  const handleSignUp = () => {
    router.push("./singup"); // ✅ Redirect to SignUp Page
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      {/* Logo */}
      <Image source={require("../assets/icons.webp")} className="w-40 h-40 mb-6 rounded-full" />

      {/* Title */}
      <Text className="text-3xl font-extrabold text-gray-800 mb-6">Welcome to PetsFinder</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full p-4 border border-gray-300 rounded-2xl mb-4 text-lg bg-gray-100 shadow-sm focus:border-pink-400 focus:shadow-md"
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        className="w-full p-4 border border-gray-300 rounded-2xl mb-6 text-lg bg-gray-100 shadow-sm focus:border-pink-400 focus:shadow-md"
        secureTextEntry
      />

      {/* Gradient Login Button */}
      <TouchableOpacity className="w-full rounded-xl overflow-hidden" onPress={handleLogin}>
        <LinearGradient colors={["#fc6767", "#ec008c"]} className="p-4 items-center">
          <Text className="text-white font-bold text-lg tracking-wide">Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Signup Link */}
      <TouchableOpacity onPress={handleSignUp}>
        <Text className="text-gray-600 mt-6 text-lg">
          Don't have an account? <Text className="text-pink-500 font-bold">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
