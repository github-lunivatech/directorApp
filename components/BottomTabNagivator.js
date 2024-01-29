import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../theme";
import Icon from "react-native-vector-icons/FontAwesome";

const BottomTabNagivator = ({ navigation }) => {
  //console.log(navigation);
  const navigateToOtherScreen = (props) => {
    if (props === "f") {
      navigation.navigate("Setting");
    } else if (props === "g") {
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomTabNagivator}>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => navigateToOtherScreen("g")}
        >
          <Icon name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => navigateToOtherScreen("f")}
        >
          <Icon name="calendar" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => navigateToOtherScreen("f")}
        >
          <Icon name="envelope" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => navigateToOtherScreen("f")}
        >
          <Icon name="user" size={30} color="black" />
        </TouchableOpacity>
      </View>
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
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  bottomTabNagivator: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 70,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    bottom: 0,
  },
  bottomTab: {
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: theme.primaryColor,
    borderRadius: 10,
  },
});

export default BottomTabNagivator;
