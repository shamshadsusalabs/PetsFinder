import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Image, ActivityIndicator } from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function Dashboard() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [rewards, setRewards] = useState({
    totalMatchingPets: 0,
    totalRewards: 0,
    petLostCount: 0,
    petFoundCount: 0,
  });

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        alert("User data not found in AsyncStorage!");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user?.id;
      const accessToken = user?.accessToken;

      if (!userId || !accessToken) {
        alert("User ID or Access Token is missing!");
        return;
      }

      const response = await fetch(`https://petsfinder-702291258008.asia-south1.run.app/api/users/getById/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data);
        setUpdatedUser({ ...data, password: "" });
        setModalVisible(true);
      } else {
        alert("Failed to fetch user details.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setLoading(false);
  };

  const fetchRewards = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        alert("User data not found in AsyncStorage!");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user?.id;
      const accessToken = user?.accessToken;

      if (!userId || !accessToken) {
        alert("User ID or Access Token is missing!");
        return;
      }

      const response = await fetch(`https://petsfinder-702291258008.asia-south1.run.app/api/rewards/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setRewards(data);
      } else {
        alert("Failed to fetch rewards.");
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const logout = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        alert("User data not found!");
        return;
      }

      const user = JSON.parse(userString);
      const accessToken = user?.accessToken;

      if (!accessToken) {
        alert("Access Token is missing!");
        return;
      }

      const response = await fetch("https://petsfinder-702291258008.asia-south1.run.app/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.removeItem("user");
        router.push("");
      } else {
        alert(result.message || "Logout failed!");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUpdatedUser({ ...updatedUser, profilePic: result.assets[0].uri });
    }
  };
  const updateProfile = async () => {
    console.log("Starting updateProfile function...");
    setLoading(true);
    console.log("Loading state set to true.");
  
    try {
      console.log("Attempting to fetch user data from AsyncStorage...");
      const userString = await AsyncStorage.getItem("user");
      console.log("User data from AsyncStorage:", userString);
  
      if (!userString) {
        console.log("User data not found in AsyncStorage!");
        alert("User data not found in AsyncStorage!");
        return;
      }
  
      console.log("Parsing user data...");
      const user = JSON.parse(userString);
      console.log("Parsed user object:", user);
  
      const accessToken = user?.accessToken;
      console.log("Access token extracted:", accessToken);
  
      if (!accessToken) {
        console.log("Access Token is missing!");
        alert("Access Token is missing!");
        return;
      }
  
      console.log("Preparing to send update request...");
      const response = await fetch(`https://petsfinder-702291258008.asia-south1.run.app/api/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(updatedUser)
      });
  
 
    
  
      const data = await response.json();

  
      if (response.ok) {
      
        setUserData(data);
        setModalVisible(false);
     
      } else {
        
        alert("Failed to update user details.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
  
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-900 items-center justify-center p-6">
      <View className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm border border-gray-700">
        <View className="flex-row items-center justify-center mb-4">
          <Ionicons name="paw" size={24} color="#FFD700" />
          <Text className="text-white text-xl font-bold ml-2">Welcome Back!</Text>
        </View>

        <Text className="text-gray-400 mb-4 text-center">
          Your Reward Points: <Text className="text-yellow-400 font-semibold">{rewards.totalRewards}</Text>
        </Text>

        <View className="space-y-2">
          {[
            { label: "Pets Matched", value: rewards.totalMatchingPets, color: "text-green-400" },
            { label: "Lost Pets Reported", value: rewards.petLostCount, color: "text-red-400" },
            { label: "Found Pets Reported", value: rewards.petFoundCount, color: "text-blue-400" },
          ].map((item, index) => (
            <TouchableOpacity key={index} className="p-3 rounded-lg bg-gray-700 flex-row justify-between items-center">
              <Text className="text-gray-300">{item.label}</Text>
              <Text className={`${item.color} font-semibold`}>{item.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="bg-blue-600 p-3 rounded-lg mt-6 flex-row items-center justify-center" onPress={fetchUserDetails}>
          <MaterialIcons name="person" size={20} color="white" />
          <Text className="text-white text-center font-bold ml-2">Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-600 p-3 rounded-lg mt-4 flex-row items-center justify-center" onPress={logout}>
          <FontAwesome name="sign-out" size={20} color="white" />
          <Text className="text-white text-center font-bold ml-2">Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4 flex-row items-center justify-center" onPress={() => router.push("./pets")}>
          <Text className="text-yellow-400 text-lg font-bold">Let’s Meet Pet To Owner</Text>
          <Ionicons name="arrow-forward" size={20} color="yellow" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-2xl w-4/5 shadow-lg border border-gray-300">
            <Text className="text-lg font-bold text-center mb-4">Update Profile</Text>

            <View className="items-center mb-4">
              {updatedUser.profilePic ? (
                <Image source={{ uri: updatedUser.profilePic }} className="w-24 h-24 rounded-full mb-2" />
              ) : (
                <View className="w-24 h-24 bg-gray-300 rounded-full mb-2 justify-center items-center">
                  <Text className="text-gray-500">No Image</Text>
                </View>
              )}
              <TouchableOpacity className="bg-gray-300 px-3 py-2 rounded-lg" onPress={selectImage}>
                <Text className="text-center text-gray-700">Upload Profile Pic</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="border p-2 rounded-lg mb-3"
              placeholder="Name"
              value={updatedUser.name}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, name: text })}
            />

            <TextInput
              className="border p-2 rounded-lg mb-3"
              placeholder="Email"
              keyboardType="email-address"
              value={updatedUser.email}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, email: text })}
            />

            <TextInput
              className="border p-2 rounded-lg mb-3"
              placeholder="Contact Number"
              keyboardType="phone-pad"
              value={updatedUser.contactNumber}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, contactNumber: text })}
            />

            <TextInput
              className="border p-2 rounded-lg mb-3"
              placeholder="New Password"
              secureTextEntry
              value={updatedUser.password}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, password: text })}
            />

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity className="bg-red-600 p-3 rounded-lg flex-1 mr-2" onPress={() => setModalVisible(false)}>
                <Text className="text-white text-center font-bold">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-blue-600 p-3 rounded-lg flex-1 ml-2" onPress={updateProfile}>
                <Text className="text-white text-center font-bold">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}