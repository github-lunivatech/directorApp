import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuthentication = async () => {
      // Check if the user is authenticated
      const userToken = await AsyncStorage.getItem("userToken");
      navigation.navigate(userToken ? "App" : "Auth");
    };

    checkAuthentication();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthLoadingScreen;
