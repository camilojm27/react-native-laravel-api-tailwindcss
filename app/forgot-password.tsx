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
  import { sendPasswordResetLink } from "../services/AuthService";
  
  export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{
      email?: string[];
    }>({});
    const [status, setStatus] = useState<string | null>(null);
  
    async function handleForgotPassword() {
      setErrors({});
      setStatus(null);
      try {
        const resetStatus = await sendPasswordResetLink(email);
        setStatus(resetStatus);
      } catch (e: any) {
        if (e.response?.status === 422) {
          console.log("errors", e.response.data.errors);
          setErrors(e.response.data.errors);
        }
        if (e.response?.status === 500) {
          console.error("errors", e.response.data);
        }
      }
    }
  
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>
          {status && <Text style={styles.resetStatus}>{status}</Text>}
          <FormTextField
            label="Email address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            errors={errors.email}
          />
          <Button title="Email Reset Password" onPress={handleForgotPassword} />
          
          <TouchableOpacity 
            style={styles.registerLink} 
            onPress={() => router.push("/login")}
          >
            <Text style={styles.registerText}>
              Back to login
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
    resetStatus: {
        marginBottom: 10,
        color: 'green',
        textAlign: 'center',
    }
  }); 