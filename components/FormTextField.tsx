import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import React from "react";

interface Props extends TextInputProps {
  label: string;
  errors?: string[];
}

export default function FormTextField({ label, errors = [], ...rest }: Props) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        {...rest}
      ></TextInput>
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
  label: {
    color: "#334155",
    fontWeight: 500,
  },
  textInput: {
    backgroundColor: "#F1F5F9",
    height: 40,
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#CBD5E1",
    padding: 10,
  },
  error: {
    color: "red",
    marginTop: 4,
  },
});
