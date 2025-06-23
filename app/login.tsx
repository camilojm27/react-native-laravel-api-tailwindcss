import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import FormTextField from "../components/FormTextField";
import { loadUser, login } from "../services/AuthService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});

  async function handleLogin() {
    setErrors({});
    try {
      console.log(email, password);
      await login({
        email,
        password,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });
      const user = await loadUser();
      console.log("user", user);``
      // Navigate to tabs after successful login
      router.replace("/(tabs)");
    } catch (errors: any) {
      if (errors.response?.status === 422) {
        console.log("errors", errors.response.data.errors);
        setErrors(errors.response.data.errors);
      }
      if (errors.response?.status === 500) {
        console.error("errors", errors.response.data);
      }
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
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
});
