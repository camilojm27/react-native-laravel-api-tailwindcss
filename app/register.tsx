import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useContext } from "react";
import { router } from "expo-router";
import FormTextField from "../components/FormTextField";
import { register, loadUser } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";

const RegisterSchema = z
  .object({
    name: z.string().min(1, "Full name is required."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const [generalError, setGeneralError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  async function handleRegister(data: RegisterFormData) {
    setGeneralError("");
    setIsLoading(true);
    try {
      await register({
        ...data,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });
      const user = await loadUser();
      setUser(user);
      router.replace("/(tabs)");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Ionicons name="person-add-outline" size={50} color="#334155" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your journey with us</Text>
        </View>

        {generalError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.generalError}>{generalError}</Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormTextField
              label="Full Name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errors={errors.name ? [errors.name.message!] : []}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormTextField
              label="Email address"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="email-address"
              errors={errors.email ? [errors.email.message!] : []}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormTextField
              label="Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              isPassword={true}
              errors={errors.password ? [errors.password.message!] : []}
            />
          )}
        />
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormTextField
              label="Confirm Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              isPassword={true}
              errors={
                errors.password_confirmation
                  ? [errors.password_confirmation.message!]
                  : []
              }
            />
          )}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(handleRegister)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginLink}>Login here</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: "#FECACA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  generalError: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: "#67BEE8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#475569",
    fontSize: 14,
  },
  loginLink: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
});
