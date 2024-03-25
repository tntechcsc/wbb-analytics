import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const TabButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#219952',
    padding: 18,
    width: 200,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: "center",
  },
});

export default TabButton;
