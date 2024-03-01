import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import theme from "../theme";
import Icon from "react-native-vector-icons/MaterialIcons";

const MISScreen = ({ navigation }) => {
  const handlePress = (routeName) => {
    if (routeName) {
      navigation.navigate(routeName);
    }
  };

  const touchableData = [
    // {
    //   key: "touchable1",
    //   heading: "Age Wise Report By Date Range",
    //   description: "View the age-wise report based on a specific date range.",
    //   icon: "date-range",
    // },
    // {
    //   key: "touchable2",
    //   heading: "Total Male, Female, Others Report",
    //   description: "Check the total count of male, female, and others.",
    //   icon: "people",
    // },
    {
      key: "GeographyReport",
      heading: "Geographical Report",
      description: "Explore geographical distribution data.",
      icon: "location-on",
    },
    // {
    //   key: "touchable4",
    //   heading: "Positive/Negative, Reactive non reactive count Report",
    //   description:
    //     "Get counts of positive, negative, reactive, and non-reactive.",
    //   icon: "check-circle",
    // },
    {
      key: "DynamicReport",
      heading: "Dynamic Report With input Date Range and Report Type",
      description:
        "Generate dynamic reports based on input date range and report type.",
      icon: "dynamic-feed",
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
            <View style={styles.touchableTextContainer}>
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  touchableTextContainer: {
    flex: 1,
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

export default MISScreen;
