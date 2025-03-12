import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Alert } from "react-native";
import Header from "./header";
import { useRouter } from "expo-router";
import { Home, PawPrint } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.191.99:5000/api/Lostpets/getAll";
const API_URL1 = "http://192.168.191.99:5000/api/Lostpets/update-match";
const API_URL2 = "http://192.168.191.99:5000/api/rewards";

// Handle Match function remains the same
const handleMatch = async (_id, rewards) => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) {
      Alert.alert("Error", "User data not found. Please log in again.");
      return;
    }

    const user = JSON.parse(userData);
    const accessToken = user?.accessToken;
    const userID = user?.id;

    if (!accessToken || !userID) {
      Alert.alert("Error", "Authentication error. Please log in again.");
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
          onPress: () => console.log("❌ User cancelled the match update"),
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
                  userID: userID,
                  petFound: rewards,
                };

                const rewardResponse = await fetch(API_URL2, {
                  method: "POST",
                  headers: headers,
                  body: JSON.stringify(rewardRequest),
                });

                const rewardResult = await rewardResponse.json();

                if (rewardResponse.ok) {
                  Alert.alert("🎉 Reward Updated", `You have earned ${rewards} points!`);
                } else {
                  Alert.alert("❌ Error", rewardResult.message || "Failed to update rewards.");
                }
              } else {
                Alert.alert("❌ Error", result.message || "Failed to update match status.");
              }
            } catch (error) {
              console.error("Error during match update:", error);
              Alert.alert("Error", "Something went wrong!");
            }
          },
        },
      ]
    );
  } catch (error) {
    console.error("Error in handleMatch:", error);
    Alert.alert("Error", "An unexpected error occurred!");
  }
};

// PetCard component remains the same
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

        <Text className="text-2xl font-bold text-gray-900 mt-4">{pet.name}</Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-gray-600 text-sm">📍 {pet.location}</Text>
          <Text className="text-black-400 text-m">
            <Text style={{ color: "rgb(230, 80, 140)", fontWeight: "bold" }}>Lost Date:- </Text>
            {new Date(pet.lastSeen).toLocaleDateString()}
          </Text>
        </View>

        <View className="mt-3">
          <Text className="text-green-600 font-bold text-sm mt-1">
            🎁 Reward: {pet.rewards ? `$${pet.rewards}` : "No reward"}
          </Text>
          <Text className="text-gray-700 text-sm">ℹ️ Details: {pet.details || "No details provided"}</Text>
        </View>

        <View className="flex-row justify-between mt-4">
          <TouchableOpacity className="flex-1 mr-2">
            <LinearGradient colors={["#ff758c", "#ff7eb3"]} className="p-4 rounded-2xl items-center">
              <Text className="text-white font-semibold text-lg">📞 {pet.contactName}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 ml-2" onPress={() => handleMatch(pet._id, pet.rewards)}>
            <LinearGradient colors={["#ff758c", "#ff7eb3"]} className="p-4 rounded-2xl items-center">
              <Text className="text-white font-semibold text-lg">🤍 Match</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

// Updated Pets Component with Filter Card
const Pets = () => {
  const router = useRouter();
  const buttonColors = ["#fc6767", "#ec008c"];
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("This Week");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (!userData) {
          console.error("User data not found!");
          return;
        }

        const user = JSON.parse(userData);
        const accessToken = user?.accessToken;

        if (!accessToken) {
          console.error("Access token not found!");
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (Array.isArray(result?.data)) {
          setPets(result.data);
          filterPets(result.data, "This Week"); // Default filter
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

  // Filter function based on pet.lastSeen
  const filterPets = (petsData, filter) => {
    const now = new Date();
    let filtered = [];

    switch (filter) {
      case "This Week":
        filtered = petsData.filter(
          (pet) => now - new Date(pet.lastSeen) <= 7 * 24 * 60 * 60 * 1000
        );
        break;
      case "This Month":
        filtered = petsData.filter(
          (pet) => now - new Date(pet.lastSeen) <= 30 * 24 * 60 * 60 * 1000
        );
        break;
      case "This Year":
        filtered = petsData.filter(
          (pet) => now - new Date(pet.lastSeen) <= 365 * 24 * 60 * 60 * 1000
        );
        break;
      case "Earlier":
        filtered = petsData.filter(
          (pet) => now - new Date(pet.lastSeen) > 365 * 24 * 60 * 60 * 1000
        );
        break;
      default:
        filtered = petsData;
    }

    setFilteredPets(filtered);
    setSelectedFilter(filter);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-50">
        <Header />
      </View>

      {/* Filter Card */}
      <View className="mx-4 mt-20 mb-4 bg-white rounded-3xl shadow-lg p-4">
        <LinearGradient colors={["#ffffff", "#f0f4f8"]} className="rounded-2xl">
          <View className="flex-row justify-between">
            {["This Week", "This Month", "This Year", "Earlier"].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => filterPets(pets, filter)}
                className={`flex-1 p-2 rounded-xl mx-1 ${
                  selectedFilter === filter ? "bg-pink-100" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    selectedFilter === filter ? "text-pink-600" : "text-gray-700"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Loading Indicator or Pet List/No Pets Message */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ff758c" />
        </View>
      ) : filteredPets.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-semibold text-gray-600">
            No pets found for this filter
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PetCard pet={item} />}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 90 }}
          className="bg-gray-100"
        />
      )}

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-white shadow-lg flex flex-row items-center justify-between">
        <Home size={40} color="rgb(230, 80, 140)" onPress={() => router.push("./volunteer")} />
        <View className="flex flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => router.push("/footer")}>
            <Text className="text-lg font-bold text-gray-900 tracking-wide border-b-2 border-gray-900">
              Reports$ Found
            </Text>
          </TouchableOpacity>
          <PawPrint size={40} color="rgb(230, 80, 140)" />
        </View>
      </View>
    </View>
  );
};

export default Pets;