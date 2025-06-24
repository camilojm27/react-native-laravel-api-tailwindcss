import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import { router } from "expo-router";
import FormTextField from "../components/FormTextField";
import { register, loadUser } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  }>({});
  const [generalError, setGeneralError] = useState<string>("");

  async function handleRegister() {
    setErrors({});
    setGeneralError("");
    try {
      console.log("Starting registration process...");
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });
      console.log("Registration successful, loading user...");
      const user = await loadUser();
      console.log("User loaded:", user);
      setUser(user);
      console.log("User set in context, navigating to tabs...");
      router.replace("/(tabs)");
    } catch (errors: any) {
      console.error("Registration failed:", errors);
      if (errors.response?.status === 422) {
        console.log("Validation errors:", errors.response.data.errors);
        setErrors(errors.response.data.errors);
      } else if (errors.response?.status === 500) {
        console.error("Server error:", errors.response.data);
        setGeneralError("Server error occurred. Please try again later.");
      } else if (errors.response) {
        // Handle other HTTP errors
        setGeneralError(`Error: ${errors.response.data.message || 'Registration failed'}`);
      } else if (errors.request) {
        // Network error
        setGeneralError("Network error. Please check your connection and try again.");
      } else {
        // Other errors
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        
        {generalError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.generalError}>{generalError}</Text>
          </View>
        ) : null}
        
        <FormTextField
          label="Full Name"
          value={name}
          onChangeText={(text) => setName(text)}
          errors={errors.name}
        />
        
        <FormTextField
          label="Email address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          errors={errors.email}
        />
        
        <FormTextField
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          errors={errors.password}
        />
        
        <FormTextField
          label="Confirm Password"
          value={passwordConfirmation}
          onChangeText={(text) => setPasswordConfirmation(text)}
          secureTextEntry={true}
          errors={errors.password_confirmation}
        />
        
        <Button title="Register" onPress={handleRegister} />
        
        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    flex: 1,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 32,
  },
  loginLink: {
    marginTop: 16,
    alignItems: "center",
  },
  loginText: {
    color: "#007AFF",
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#FFD1D1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  generalError: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
