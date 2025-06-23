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

export default function Register() {
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

  async function handleRegister() {
    setErrors({});
    try {
      console.log("Registration:", { name, email, password, passwordConfirmation });
      // Add your registration logic here
      // For now, just navigate to login
      router.replace("/login");
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
        <Text style={styles.title}>Create Account</Text>
        
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
});
