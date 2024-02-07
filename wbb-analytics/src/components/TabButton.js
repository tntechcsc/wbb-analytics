import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const TabButton = ({ text }) => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
   button: {
    display: "flex",
    justifyContent: "left",
    backgroundColor: '#219952',
    padding: 18,
    width: 200,
    height: 60,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: "center",
  },
});

export default TabButton;