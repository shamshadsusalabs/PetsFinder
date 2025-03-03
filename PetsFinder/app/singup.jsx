import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contactNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be digits")
    .min(10, "Must be at least 10 digits")
    .required("Contact number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const SignupForm = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.assets || result.assets.length === 0) return;
    setProfilePic(result.assets[0].uri);
  };

  // Function to handle form submission
  const handleSignup = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("contactNumber", values.contactNumber);
      formData.append("password", values.password);
  
      if (profilePic) {
        formData.append("profilePic", {
          uri: profilePic,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }
  
      const response = await axios.post("https://petsfinder-702291258008.asia-south1.run.app/api/users/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      Alert.alert("Success", "User registered successfully!");
  
      
      resetForm();
      setProfilePic(null);
    } catch (error) {
     
      Alert.alert("Error", error.response?.data?.message || "Registration failed!");
    }
    setLoading(false);
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="p-6">
          {/* Banner Image */}
          <Image source={require("../assets/icons.webp")} className="w-full h-44 rounded-lg shadow-md mb-5" />

          <Formik
            initialValues={{ name: "", email: "", contactNumber: "", password: "", type: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
                {/* Profile Picture Upload */}
                <TouchableOpacity onPress={pickImage} className="items-center mb-5">
                  {profilePic ? (
                    <Image source={{ uri: profilePic }} className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md" />
                  ) : (
                    <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center border-2 border-gray-300 shadow-md">
                      <Text className="text-gray-500">Upload</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Name Input */}
                <TextInput
                  placeholder="Full Name"
                  className="border rounded-lg p-4 mb-3 bg-white shadow-md"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
                {touched.name && errors.name && <Text className="text-red-500 text-xs">{errors.name}</Text>}

                {/* Email Input */}
                <TextInput
                  placeholder="Email Address"
                  className="border rounded-lg p-4 mb-3 bg-white shadow-md"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && errors.email && <Text className="text-red-500 text-xs">{errors.email}</Text>}

                {/* Contact Number */}
                <TextInput
                  placeholder="Contact Number"
                  className="border rounded-lg p-4 mb-3 bg-white shadow-md"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("contactNumber")}
                  onBlur={handleBlur("contactNumber")}
                  value={values.contactNumber}
                />
                {touched.contactNumber && errors.contactNumber && <Text className="text-red-500 text-xs">{errors.contactNumber}</Text>}

                {/* Password Input */}
                <TextInput
                  placeholder="Password"
                  className="border rounded-lg p-4 mb-3 bg-white shadow-md"
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                {touched.password && errors.password && <Text className="text-red-500 text-xs">{errors.password}</Text>}

                {/* Submit Button */}
                <TouchableOpacity onPress={handleSubmit} className="rounded-lg overflow-hidden shadow-md mt-4">
                  <LinearGradient colors={["#ff7e5f", "#feb47b"]} start={[0, 0]} end={[1, 1]} className="p-4 flex items-center">
                    {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-lg font-semibold">Sign Up</Text>}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupForm;
