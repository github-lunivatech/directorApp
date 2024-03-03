import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Logo from "../assets/luniva360.png";

const { width, height } = Dimensions.get("window");

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.8, // Adjust as needed
    height: height * 0.8, // Adjust as needed
    resizeMode: "contain",
  },
});

export default LoadingScreen;
