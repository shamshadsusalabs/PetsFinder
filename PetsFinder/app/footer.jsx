import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Home, PawPrint } from "lucide-react-native";
const Footer = () => {
  const router = useRouter();
  const buttonColors = ["#fc6767", "#ec008c"]; // Same gradient for all buttons

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      {/* Parent Card (Centered) */}
      <View className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm items-center">
        
        {/* Lost Dogs Report */}
        <TouchableOpacity onPress={() => router.push("./lostpets")} activeOpacity={0.8} className="w-full mb-4">
          <LinearGradient
            colors={buttonColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-5 px-6 rounded-2xl items-center shadow-xl w-full"
          >
            <Text className="text-white font-semibold text-sm opacity-80 mb-1">
              Is your dog or cat missing?
            </Text>
            <Text className="text-white font-extrabold text-xl tracking-wider">
              🐶 Report Lost Animal
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Found Dogs Report */}
        <TouchableOpacity onPress={() => router.push("./fountPets")} activeOpacity={0.8} className="w-full mb-4">
          <LinearGradient
            colors={buttonColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-5 px-6 rounded-2xl items-center shadow-xl w-full"
          >
            <Text className="text-white font-semibold text-sm opacity-80 mb-1">
              Have you Found a dog or a cat and don't know who it belongs to?
            </Text>
            <Text className="text-white font-extrabold text-xl tracking-wider">
              🏠Report New Found Animal
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Match Pets Button */}
        <TouchableOpacity onPress={() => router.push("./match")} activeOpacity={0.8} className="w-full">
          <LinearGradient
            colors={buttonColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-5 px-6 rounded-2xl items-center shadow-xl w-full"
          >
          
            <Text className="text-white font-extrabold text-xl tracking-wider">
            🐾 AI Match (Lost & Found) 
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default Footer;
