import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

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
              Is your pet lost?
            </Text>
            <Text className="text-white font-extrabold text-xl tracking-wider">
              🐶 Lost Pets Reports
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
              Did you find any pets?
            </Text>
            <Text className="text-white font-extrabold text-xl tracking-wider">
              🏠 Found Pets Reports
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
              🔍 Match Lost & Found Pets
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default Footer;
