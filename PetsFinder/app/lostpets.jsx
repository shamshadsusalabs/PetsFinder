import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../global.css";

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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Required fields
  const requiredFields = [
    'lastSeen', 'ownerName', 'contactName', 'location', 'image',
    'gender', 'sterilised', 'earClip', 'tailCut', 'leg',
    'size', 'body', 'colour'
  ];

  // Calculate form completion percentage
  const calculateProgress = useCallback(() => {
    const totalFields = requiredFields.length;
    let filledFields = 0;

    requiredFields.forEach(field => {
      if (field === 'lastSeen') {
        if (petDetails[field].toString() !== new Date().toString()) filledFields++;
      } else if (petDetails[field] && petDetails[field] !== "") {
        filledFields++;
      }
    });

    const percentage = Math.round((filledFields / totalFields) * 100);
    setFormProgress(percentage);
  }, [petDetails]);

  useEffect(() => {
    calculateProgress();
  }, [petDetails, calculateProgress]);

  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPetDetails(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  }, []);

  const openCamera = useCallback(async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPetDetails(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  }, []);

  const onDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      setPetDetails(prev => ({ ...prev, lastSeen: selectedDate }));
    }
    setShowDatePicker(false);
  }, []);

  const submitForm = useCallback(async () => {
    setLoading(true);
    try {
      // Check all required fields
      const emptyFields = requiredFields.filter(field => {
        if (field === 'image') return !petDetails[field];
        if (field === 'lastSeen') return !petDetails[field];
        return petDetails[field] === "";
      });

      if (emptyFields.length > 0) {
        const emptyFieldNames = emptyFields.map(field => formatFieldName(field)).join(', ');
        Alert.alert(
          "Error", 
          `Please fill all required fields: ${emptyFieldNames}`
        );
        setLoading(false);
        return;
      }

      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        Alert.alert("Error", "User data not found!");
        return;
      }

      const user = JSON.parse(userData);
      const accessToken = user?.accessToken;
      const userId = user?.id;

      if (!accessToken || !userId) {
        Alert.alert("Error", "User authentication failed!");
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

      const response = await fetch("http://192.168.191.99:5000/api/Lostpets/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Pet report submitted successfully! Form 100% complete");
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
      setLoading(false);
    }
  }, [petDetails]);

  const formatFieldName = useCallback((field) => {
    const specialCases = {
      'Indianbreed': 'Indian Breed',
      'Importedbreed': 'Imported Breed'
    };

    if (specialCases[field]) {
      return specialCases[field];
    }

    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white mt-6">
      <Text className="text-3xl font-extrabold text-gray-900 mb-6 text-center">🐾 Report Lost Dogs and Cats</Text>
      
      {/* Progress Indicator */}
      <View className="mb-6 px-4">
        <Text className="text-lg font-semibold text-gray-700">
          Form Completion: {formProgress}%
        </Text>
        <View className="w-full h-2 bg-gray-200 rounded-full mt-2">
          <View 
            className="h-2 bg-blue-500 rounded-full" 
            style={{ width: `${formProgress}%` }}
          />
        </View>
      </View>

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

      <TextInput
        placeholder="Owner Name  *"
        className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
        value={petDetails.ownerName}
        onChangeText={(text) => setPetDetails(prev => ({ ...prev, ownerName: text }))}
      />
      <TextInput
        placeholder="Contact Details  *"
        className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
        value={petDetails.contactName}
        onChangeText={(text) => setPetDetails(prev => ({ ...prev, contactName: text }))}
      />
      <TextInput
        placeholder="Location  *"
        className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
        value={petDetails.location}
        onChangeText={(text) => setPetDetails(prev => ({ ...prev, location: text }))}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm">
        <Text>{petDetails.lastSeen.toLocaleString()} *</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={petDetails.lastSeen}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      <TextInput
        placeholder="Animal Name"
        className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
        value={petDetails.name}
        onChangeText={(text) => setPetDetails(prev => ({ ...prev, name: text }))}
      />
      <TextInput
        placeholder="Details Story"
        className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
        value={petDetails.details}
        onChangeText={(text) => setPetDetails(prev => ({ ...prev, details: text }))}
      />
      <TextInput
        placeholder="Rewards offered"
        className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
        value={petDetails.rewards}
        onChangeText={(text) => setPetDetails(prev => ({ ...prev, rewards: text }))}
      />

      {["gender", "sterilised", "earClip", "tailCut", "leg", "size", "body", "colour", "Indianbreed", "Importedbreed", "noseColour", "eyeColour", "injury", "underTreatment"].map((field) => (
        <View key={field} className="border p-2 rounded-lg mb-4 bg-gray-50 shadow-sm">
          <Picker 
            selectedValue={petDetails[field]} 
            onValueChange={(value) => setPetDetails(prev => ({ ...prev, [field]: value }))}
          >
            <Picker.Item label={`Select ${formatFieldName(field)}${requiredFields.includes(field) ? ' *' : ''}`} value="" />
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

export default React.memo(LostPetsForm);