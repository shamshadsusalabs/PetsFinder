import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform, Alert , ActivityIndicator} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import "../global.css"
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const LostPetsForm = () => {
 const [petDetails, setPetDetails] = useState({
     name: "",
     Indianbreed: "",
     Importedbreed: "",
     lastSeen: new Date(),
     location: "",
     ownerName: "",
     contactName: "",
     gender: "",
     sterilised: "",
     earClip: "",
     tailCut: "",
     leg: "",
     size: "",
     body: "",
     colour: "",
     noseColour: "",
     eyeColour: "",
     injury: "",
     underTreatment: "",
     image: null,
     details: "",
     rewards: "",
   });
 

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPetDetails({ ...petDetails, image: result.assets[0].uri });
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPetDetails({ ...petDetails, image: result.assets[0].uri });
    }
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setPetDetails({ ...petDetails, lastSeen: selectedDate });
    }
    setShowDatePicker(false);
  };

  const [loading, setLoading] = useState(false); // Loading state

  const submitForm = async () => {
    setLoading(true); // Loader start
    try {
      const { lastSeen, ownerName, contactName, location, image, ...optionalFields } = petDetails;
      
      if (!lastSeen || !ownerName || !contactName || !location || !image) {
        Alert.alert("Error", "Please fill all required fields marked with *");
        setLoading(false);
        return;
      }
  
      const isAtLeastOneOptionalFieldFilled = Object.values(optionalFields).some(
        (value) => value !== "" && value !== null
      );
  
      if (!isAtLeastOneOptionalFieldFilled) {
        Alert.alert("Error", "Please fill at least one optional field.");
        setLoading(false);
        return;
      }
  
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        Alert.alert("Error", "User data not found!");
        setLoading(false);
        return;
      }
  
      const user = JSON.parse(userData);
      const accessToken = user?.accessToken;
      const userId = user?.id;
  
      if (!accessToken || !userId) {
        Alert.alert("Error", "User authentication failed!");
        setLoading(false);
        return;
      }
  
      const formData = new FormData();
      Object.keys(petDetails).forEach((key) => {
        if (key === "image" && petDetails.image) {
          formData.append("image", {
            uri: petDetails.image,
            name: "pet_image.jpg",
            type: "image/jpeg",
          });
        } else if (key === "lastSeen") {
          formData.append("lastSeen", petDetails.lastSeen.toISOString());
        } else {
          formData.append(key, petDetails[key]);
        }
      });
  
      formData.append("userId", userId);
  
      const response = await fetch("http://192.168.229.99:5000/api/Lostpets/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Pet report submitted successfully!");
        setPetDetails({
          name: "",
          Indianbreed: "",
          Importedbreed: "",
          lastSeen: new Date(),
          location: "",
          ownerName: "",
          contactName: "",
          gender: "",
          sterilised: "",
          earClip: "",
          tailCut: "",
          leg: "",
          size: "",
          body: "",
          colour: "",
          noseColour: "",
          eyeColour: "",
          injury: "",
          underTreatment: "",
          image: null,
          details: "",
          rewards: "",
        });
      } else {
        Alert.alert("Error", result.message || "Something went wrong!");
      }
    } catch (error) {
  
      Alert.alert("Error", "Failed to submit the form.");
    } finally {
      setLoading(false); // Loader stop
    }
  };
 

return (
  
  <ScrollView className="flex-1 bg-white mt-6">
 
    <Text className="text-3xl font-extrabold text-gray-900 mb-6 text-center">🐾 Report Lost Pets</Text>

    {/* Image Section */}
   
    <View className="items-center mb-6">
      {petDetails.image ? (
        <Image source={{ uri: petDetails.image }} className="w-36 h-36 rounded-lg mb-2 shadow-lg" />
      ) : (
        <View className="w-36 h-36 bg-gray-300 rounded-lg items-center justify-center mb-2 shadow-md">
          <Ionicons name="paw-outline" size={48} color="#666" />
        </View>
      )}
      <View className="flex-row">
        <TouchableOpacity onPress={pickImage} className="p-4 bg-blue-500 rounded-full mx-2 shadow-md">
          <Ionicons name="image-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openCamera} className="p-4 bg-green-500 rounded-full mx-2 shadow-md">
          <Ionicons name="camera-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Required Fields */}
    <TextInput
      placeholder="Owner Name*"
      className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
      value={petDetails.ownerName}
      onChangeText={(text) => setPetDetails({ ...petDetails, ownerName: text })}
    />
    <TextInput
      placeholder="Contact Details*"
      className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
      value={petDetails.contactName}
      onChangeText={(text) => setPetDetails({ ...petDetails, contactName: text })}
    />
    <TextInput
      placeholder="Location*"
      className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
      value={petDetails.location}
      onChangeText={(text) => setPetDetails({ ...petDetails, location: text })}
    />
    <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm">
      <Text>{petDetails.lastSeen.toLocaleString()}</Text>
    </TouchableOpacity>

    {showDatePicker && (
      <DateTimePicker
        value={petDetails.lastSeen}
        mode="date"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onDateChange}
      />
    )}

    {/* Optional Fields */}
    <TextInput
      placeholder="Pet Name"
      className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
      value={petDetails.name}
      onChangeText={(text) => setPetDetails({ ...petDetails, name: text })}
    />
    <TextInput
      placeholder="Details"
      className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
      value={petDetails.details}
      onChangeText={(text) => setPetDetails({ ...petDetails, details: text })}
    />
    <TextInput
      placeholder="Rewards"
      className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
      value={petDetails.rewards}
      onChangeText={(text) => setPetDetails({ ...petDetails, rewards: text })}
    />

    {/* Dropdowns for Optional Fields */}
    {["Indianbreed", "Importedbreed", "gender", "sterilised", "earClip", "tailCut", "leg", "size", "body", "colour", "noseColour", "eyeColour", "injury", "underTreatment"].map((field) => (
      <View key={field} className="border p-2 rounded-lg mb-4 bg-gray-50 shadow-sm">
        <Picker selectedValue={petDetails[field]} onValueChange={(value) => setPetDetails({ ...petDetails, [field]: value })}>
          <Picker.Item label={`Select ${field}`} value="" />
          {getOptions(field).map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
    ))}
    {loading && (
      <View className="items-center mb-4">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )}
    {/* Submit Button */}
    <TouchableOpacity onPress={submitForm} className="mt-6 shadow-lg">
      <LinearGradient colors={["#ff512f", "#dd2476"]} style={{ padding: 15, borderRadius: 10, alignItems: "center" }}>
        <Text className="text-white font-bold text-lg uppercase tracking-wide">Submit Report</Text>
      </LinearGradient>
    </TouchableOpacity>
  </ScrollView>
);
};

const getOptions = (field) => {
  const options = {
    Indianbreed: [
      "Indie", "Indie Mix", "Lab Mix", "Rottweiler Mix", "Doberman Mix", 
      "German Shepherd Mix", "Pom Mix", "Spitz Mix", "others"
    ],
    Importedbreed: ["Labrador", "Rottweiler", "German Shepherd", "Pomeranian", "Spitz", "Shih Tzu", "Beagle", "Pit Bull", "American Bully", "Pakistani Bully", "Golden Retriever", "Dalmatian", "Pug", "Other"],
    gender: ["Male", "Female"],
    sterilised: ["Yes", "No"],
    earClip: ["Left", "Right"],
    tailCut: ["Yes", "No"],
    leg: ["4 Legs", "3 Legs", "Limp (Indian)", "Limp (Imported)", "Front Leg (Indian)", "Front Leg (Imported)", "other"],
    size: ["Big", "Small", "other"],
    body: ["Fat", "Thin", "medium", "other"],
    colour: ["White", "White & Black", "Brown", "White & Brown", "Reddish", "Patches", "other"],
    noseColour: ["Black", "Pink", "Red", "Spots", "other"],
    eyeColour: ["Black", "Brown", "other"],
    injury: ["Yes", "No"],
    underTreatment: ["Yes", "No"],
  };
  return options[field] || [];
};


export default LostPetsForm;
