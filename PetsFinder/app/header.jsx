import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <LinearGradient 
      colors={["#ff8a8a", "#ff2a74"]} 
      className="py-2 px-3 flex-row justify-evenly items-center rounded-b-2xl shadow-md"
    >
      {/* Lost Button */}
      <TouchableOpacity onPress={() => router.push("./pets")} className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 shadow">
        <Text className="text-white text-base font-semibold tracking-wide">Lost</Text>
      </TouchableOpacity>

      {/* Found Button */}
      <TouchableOpacity 
      onPress={() => router.push("/petsFound")}  // 🔥 Correct absolute path
      className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 shadow"
      accessible={true}
      accessibilityLabel="View found pets"
    >
      <Text className="text-white text-base font-semibold tracking-wide">Found</Text>
    </TouchableOpacity>
  
      {/* Search Bar */}
    
    </LinearGradient>
  );
};

export default Header;
