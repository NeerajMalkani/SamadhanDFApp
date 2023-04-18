import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";

export default function CustomButton(props) {
  const { onPress, title = "Save", color, disabled, textcolor } = props;
  return (
    <Pressable
      style={{ ...styles.button, backgroundColor: color }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{ color: textcolor, ...styles.text }}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});
