import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from "../theme";
import Icon from "react-native-vector-icons/FontAwesome";
import { BottomNavigation } from "react-native-paper";
import BottomTabNagivator from "../components/BottomTabNagivator";

const Setting = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.navigate("Auth");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      {/* <View style={styles.bottomTabNagivator}>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => navigateToOtherScreen("g")}
        >
          <Icon name="home" size={30} color="#fff" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => navigateToOtherScreen("f")}
        >
          <Icon name="gear" size={30} color="#fff" />
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
      </View> */}
      <BottomTabNagivator navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: theme.primaryColor,
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  bottomTabNagivator: {
    flexDirection: "row",
    backgroundColor: theme.primaryColor,
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
  },
  bottomTab: {
    alignItems: "center",
    width: 165,
  },
});

export default Setting;
