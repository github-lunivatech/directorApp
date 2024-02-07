import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

const SampleDetails = ({ navigation }) => {
  const handlePress = (key) => {
    navigation.navigate("SampleStatus", key);
  };

  const touchableData = [
    {
      key: "1",
      heading: "Pending Sample Reports",
      description: "View the total sample details with their pending status.",
      icon: "info",
    },
    {
      key: "2",
      heading: "Done Sample Reports",
      description:
        "Explore the list of detailed information about completed samples.",
      icon: "list",
    },
    {
      key: "3",
      heading: "Verified Sample Reports",
      description: "Authorize reports with additional options.",
      icon: "how-to-vote",
    },
    {
      key: "4",
      heading: "Authorized Sample Reports",
      description: "View reports in a read-only form.",
      icon: "remove-red-eye",
    },
    {
      key: "5",
      heading: "Rejected Sample Reports",
      description:
        "View the list of rejected sample reports and take necessary actions.",
      icon: "email",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {touchableData.map(({ key, heading, description, icon }, index) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.touchable,
            { backgroundColor: index % 2 === 0 ? "#F6F5FB" : "#FFF4F4" },
          ]}
          onPress={() => handlePress(key)}
        >
          <View style={styles.touchableContent}>
            <Icon
              name={icon}
              size={20}
              color={index % 2 === 0 ? "#403572" : "#FF5648"}
              style={styles.icon}
            />
            <View>
              <Text
                style={[
                  styles.touchableHeading,
                  { color: index % 2 === 0 ? "#403572" : "#FF5648" },
                ]}
              >
                {heading}
              </Text>
              <Text
                style={[
                  styles.touchableDescription,
                  { color: index % 2 === 0 ? "#403572" : "#A27A7A" },
                ]}
              >
                {description}
              </Text>
            </View>
          </View>
          <Icon
            name="keyboard-arrow-right"
            size={24}
            color="grey"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  touchable: {
    width: "90%",
    marginVertical: 10,
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    position: "relative",
    height: 130,
  },
  touchableContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  touchableHeading: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  touchableDescription: {
    color: "#fff",
    fontSize: 12,
    marginRight: 40,
    marginTop: 10,
  },
  arrowIcon: {
    position: "absolute",
    right: 10,
    top: 55,
  },
});

export default SampleDetails;
