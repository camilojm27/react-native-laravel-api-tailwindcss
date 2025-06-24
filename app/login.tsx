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
import { loadUser, login } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});
  const [generalError, setGeneralError] = useState<string>("");

  async function handleLogin() {
    setErrors({});
    setGeneralError("");
    try {
      console.log(email, password);
      await login({
        email,
        password,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });
      const user = await loadUser();
      console.log("user", user);
      setUser(user);
      // Navigate to tabs after successful login
      router.replace("/(tabs)");
    } catch (errors: any) {
      console.error("Login failed:", errors);
      if (errors.response?.status === 422) {
        console.log("Validation errors:", errors.response.data.errors);
        setErrors(errors.response.data.errors);
      } else if (errors.response?.status === 401) {
        setGeneralError("Invalid credentials. Please check your email and password.");
      } else if (errors.response?.status === 500) {
        console.error("Server error:", errors.response.data);
        setGeneralError("Server error occurred. Please try again later.");
      } else if (errors.response) {
        setGeneralError(`Error: ${errors.response.data.message || 'Login failed'}`);
      } else if (errors.request) {
        setGeneralError("Network error. Please check your connection and try again.");
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        
        {generalError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.generalError}>{generalError}</Text>
          </View>
        ) : null}
        
        <FormTextField
          label="Email address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          errors={errors.email}
        />
        <FormTextField
          label="Password:"
          value={password}
          onChangeText={(text) => setPassword(text)}
          keyboardType="default"
          secureTextEntry={true}
          errors={errors.password}
        />
        <Button title="Login" onPress={handleLogin} />
        
        <TouchableOpacity 
          style={styles.registerLink} 
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerText}>
            Don't have an account? Register here
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerLink} 
          onPress={() => router.push("/forgot-password")}
        >
          <Text style={styles.registerText}>
            Forgot Password?
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
  registerLink: {
    marginTop: 16,
    alignItems: "center",
  },
  registerText: {
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
    fontSize: 14,
    fontWeight: "bold",
  },
});
