import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Props extends TextInputProps {
  label: string;
  errors?: string[];
  isPassword?: boolean;
}

export default function FormTextField({
  label,
  errors = [],
  isPassword = false,
  ...rest
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        ></TextInput>
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.icon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
      {errors.map((error) => {
        return (
          <Text key={error} style={styles.error}>
            {error}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: "#334155",
    fontWeight: "500",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    borderColor: "#CBD5E1",
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  icon: {
    padding: 10,
  },
  error: {
    color: "red",
    marginTop: 4,
  },
});
