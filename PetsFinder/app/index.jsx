import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import "../global.css";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons"; // Import for eye icon
const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  // State for input fields
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");



  const handleLogin = async () => {
    console.log("Function handleLogin called"); // Log when the function is called
  
    try {
      console.log("Sending login request..."); // Log before making the fetch request
  
      const response = await fetch("http://192.168.191.99:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactNumber, password }), // Use contactNumber instead of email
      });
  
      console.log("Response received:", response); // Log the response object
  
      const data = await response.json();
      console.log("Parsed response data:", data); // Log the parsed JSON data
  
      if (response.ok) {
        console.log("Login successful, saving user data to AsyncStorage..."); // Log before saving data
  
        await AsyncStorage.setItem("user", JSON.stringify(data));
        console.log("User data saved to AsyncStorage"); // Log after saving data
  
        console.log("Redirecting to Pets Page..."); // Log before redirecting
        router.push("./pets");
      } else {
        console.log("Login failed, showing alert..."); // Log before showing alert
        Alert.alert("Invalid Credentials", data?.message || "Please check your contact number and password.");
      }
    } catch (error) {
      console.error("Error occurred:", error); // Log the error object
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleSignUp = () => {
    router.push("./singup"); // Redirect to SignUp Page
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      {/* Logo */}
      <Image source={require("../assets/Dog Tag Mission Logo (5).png")} className="w-40 h-40 mb-6 rounded-full" />

      {/* Title */}
      <Text className="text-3xl font-extrabold text-gray-800 mb-6">Welcome to PetsFinder</Text>

      {/* Contact Number Input */}
      <TextInput
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad" // Use phone-pad keyboard for contact number
        className="w-full p-4 border border-gray-300 rounded-2xl mb-4 text-lg bg-gray-100 shadow-sm focus:border-pink-400 focus:shadow-md"
      />

      {/* Password Input */}
      <View className="w-full relative">
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        className="w-full p-4 pr-12 border border-gray-300 rounded-2xl text-lg bg-gray-100 shadow-sm focus:border-pink-400 focus:shadow-md"
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity 
        onPress={() => setShowPassword(!showPassword)} 
        className="absolute right-4 top-4"
      >
        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
      </TouchableOpacity>
    </View>

      {/* Gradient Login Button */}
      <TouchableOpacity className="w-full rounded-xl mt-4 overflow-hidden" onPress={handleLogin}>
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