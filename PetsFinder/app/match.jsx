import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const Match = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchingPets = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (!user) return;
        const userId = JSON.parse(user).id;
        const response = await axios.get(`https://petsfinder-702291258008.asia-south1.run.app/api/Foundpets/matching-pets/${userId}`);
        setPets(response.data.data);
      } catch (error) {
    
      } finally {
        setLoading(false);
      }
    };
    fetchMatchingPets();
  }, []);

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Not available";
    return new Date(timestamp).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <LinearGradient colors={["#f9f9f9", "#e5e5e5"]} className="flex-1 p-4">
      <Text className="text-4xl font-extrabold text-center text-black mb-6">🐾 Matching Pets</Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ff6f61" />
          <Text className="text-gray-400 mt-2">Loading...</Text>
        </View>
      ) : pets.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">No matching pets found. 🐾</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="mb-6 bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Pet Image with Gradient Overlay */}
              <View className="relative">
                <Image source={{ uri: item.image }} className="w-full h-96" resizeMode="cover" />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  className="absolute bottom-0 w-full p-4"
                >
                  <Text className="text-2xl font-bold text-white">{item.name || "Unknown"}</Text>
                  <Text className="text-gray-200 text-sm">Breed: {item.Indianbreed || item.Importedbreed || "Unknown"}</Text>
                </LinearGradient>
              </View>

              {/* Pet Details */}
              <View className="p-4">
                {/* Location & Last Seen */}
                <View className="flex-row items-center mb-2">
                  <Icon name="map-marker" size={20} color="#ff6f61" />
                  <Text className="text-gray-600 ml-2">{item.location || "Unknown"}</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Icon name="clock-outline" size={18} color="#ffa500" />
                  <Text className="text-gray-600 ml-2">Last Seen: {formatDateTime(item.lastSeen)}</Text>
                </View>

                {/* Contact Button */}
                {item.contactName && (
                  <TouchableOpacity className="flex-row items-center px-4 py-2 mt-4 bg-[#ff6f61] rounded-full shadow-md">
                    <Icon name="phone" size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Contact {item.contactName}</Text>
                  </TouchableOpacity>
                )}

                {/* Reward */}
                {item.reward && (
                  <Text className="text-yellow-600 text-lg font-bold mt-3">🏆 Reward: {item.reward}</Text>
                )}

                {/* Additional Info */}
                <Text className="text-gray-700 mt-3">📌 {item.details || "No details available."}</Text>
              </View>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
};

export default Match;
