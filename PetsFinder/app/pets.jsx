import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Alert } from "react-native";
import Header from "./header";
import { useRouter } from "expo-router";

import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = "https://petsfinder-702291258008.asia-south1.run.app/api/Lostpets/getAll";

const API_URL1 = "https://petsfinder-702291258008.asia-south1.run.app/api/Lostpets/update-match"; 
const API_URL2 = "https://petsfinder-702291258008.asia-south1.run.app/api/rewards";
 // Same gradient for both buttons
const handleMatch = async (_id,rewards) => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) {
      return;
    }

    const user = JSON.parse(userData);
    const accessToken = user?.accessToken;
    const userID = user?.id;

    if (!accessToken || !userID) {
      return;
    }

    // Show confirmation alert
    Alert.alert(
      "Confirm Match",
      "Are you sure this pet is matched?",
      [
        { 
          text: "No", 
          style: "cancel",
          onPress: () => console.log("❌ User cancelled the match update")
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const apiUrl = `${API_URL1}/${_id}`;
              const requestBody = JSON.stringify({ match: true });

              const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              };

          

              const response = await fetch(apiUrl, {
                method: "PUT",
                headers: headers,
                body: requestBody,
              });

              const result = await response.json();

              if (response.ok) {
           
                Alert.alert("✅ Success", "Pet marked as matched!");

            
                const rewardRequest = {
                  userID: userID,  // Correct user ID
                  petLost: rewards,  // Add 50 reward points
                };


                const rewardResponse = await fetch(API_URL2, {
                  method: "POST",
                  headers: headers,
                  body: JSON.stringify(rewardRequest),
                });

                const rewardResult = await rewardResponse.json();
             

                if (rewardResponse.ok) {
                

                  Alert.alert(`🎉 Reward Updated", "You have earned ${rewards} points!`);
                } else {
              
                  Alert.alert("❌ Error", rewardResult.message || "Failed to update rewards.");
                }
              } else {
                
                Alert.alert("❌ Error", result.message || "Failed to update match status.");
              }
            } catch (error) {
             
              Alert.alert("Error", "Something went wrong!");
            }
          },
        },
      ]
    );
  } catch (error) {
 
    Alert.alert("Error", "An unexpected error occurred!");
  }
};




const PetCard = ({ pet }) => {
  const isRecentlyAdded = new Date() - new Date(pet.createdAt) < 3 * 24 * 60 * 60 * 1000;

  return (
    <View className="shadow-xl rounded-3xl overflow-hidden bg-white mb-6 mx-4">
      <LinearGradient colors={["#ffffff", "#f0f4f8"]} className="p-6 rounded-3xl">

        {/* Pet Image with Recently Added Badge */}
        <View className="relative">
          <Image 
            source={{ uri: pet.image && pet.image !== "null" ? pet.image : "https://via.placeholder.com/150" }} 
            className="w-full h-56 rounded-2xl"
          />
          {isRecentlyAdded && (
            <LinearGradient colors={["#ff7eb3", "#ff758c"]} className="absolute top-3 left-3 px-4 py-1 rounded-full">
              <Text className="text-white font-bold text-xs">🔥 New Arrival</Text>
            </LinearGradient>
          )}
        </View>

        {/* Pet Info */}
        <Text className="text-2xl font-bold text-gray-900 mt-4">{pet.name}</Text>

        {/* Location & Date */}
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-gray-600 text-sm">📍 {pet.location}</Text>
          <Text className="text-black-400 text-m">🕒 {new Date(pet.lastSeen).toLocaleDateString()}</Text>
        </View>

        {/* Details & Reward */}
        <View className="mt-3">
          <Text className="text-gray-700 text-sm">ℹ️ Details: {pet.details || "No details provided"}</Text>
          <Text className="text-green-600 font-bold text-sm mt-1">🎁 Reward: {pet.rewards ? `$${pet.rewards}` : "No reward"}</Text>
        </View>

        {/* Call & Match Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity className="flex-1 mr-2">
            <LinearGradient colors={["#ff758c", "#ff7eb3"]} className="p-4 rounded-2xl items-center">
              <Text className="text-white font-semibold text-lg">📞 {pet.contactName}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 ml-2" onPress={() => handleMatch(pet._id,pet.rewards)}>
            <LinearGradient colors={["#ff758c", "#ff7eb3"]} className="p-4 rounded-2xl items-center">
              <Text className="text-white font-semibold text-lg">💚 Match</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </View>
  );
};





const Pets = () => {
  const router = useRouter();
  const buttonColors = ["#fc6767", "#ec008c"];
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const userData = await AsyncStorage.getItem('user'); // Get user data as string
        if (!userData) {
          console.error("User data not found!");
          return;
        }
  
        const user = JSON.parse(userData); // Convert to object
        const accessToken = user?.accessToken; // Extract access token
  
        if (!accessToken) {
          console.error("Access token not found!");
          return;
        }
  
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Send token
          },
        });
  
        const result = await response.json();
       
  
        if (Array.isArray(result?.data)) {
          setPets(result.data);
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPets();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      {/* 🔹 Header */}
      <View className="absolute top-0 left-0 right-0 z-50">
        <Header />
      </View>

      {/* 🔹 Loading Indicator */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ff758c" />
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PetCard pet={item} />}
          contentContainerStyle={{ paddingTop: 80, paddingBottom: 90 }}
          className="bg-gray-100"
        />
      )}

      {/* 🔹 Footer */}
      <View className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-white shadow-lg flex flex-row items-center justify-center">
      <TouchableOpacity onPress={() => router.push("/footer")}>
        <Text className="text-lg font-bold text-gray-900 tracking-wide border-b-2 border-gray-900">
          Let's Match →
        </Text>
      </TouchableOpacity>
    </View>
    
    
    </View>
  );
};

export default Pets;