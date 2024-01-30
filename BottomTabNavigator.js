import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen"; // Import your Home screen component
import MessagesScreen from "./screens/login/LogoutScreen"; // Import your Messages screen component
import CalendarScreen from "./screens/login/LogoutScreen"; // Import your Calendar screen component
import ProfileScreen from "./screens/login/LogoutScreen"; // Import your Profile screen component
import AppNavigator from "./AppNavigator";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
