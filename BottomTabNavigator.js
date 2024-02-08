// BottomTabNavigator.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/login/LoginScreen";

import HomeScreen from "./screens/HomeScreen";
import MessagesScreen from "./screens/login/LogoutScreen";
import CalendarScreen from "./screens/login/LogoutScreen";
import ProfileScreen from "./screens/login/LogoutScreen";

import FinancialScreen from "./screens/FinancialScreen";
import MISScreen from "./screens/MISScreen";
import AnalysisScreen from "./screens/AnalysisScreen";
import MedicalScreenScreen from "./screens/MedicalScreen";
import InventoryScreen from "./screens/InventoryScreen";
import SettingScreen from "./screens/SettingScreen";

import TotalSales from "./screens/tables/FinanceTable/TotalSales";
import PartyWiseSales from "./screens/tables/FinanceTable/PartyWiseSales";
import RefererWiseSales from "./screens/tables/FinanceTable/RefererWiseSales";
import CashSales from "./screens/tables/FinanceTable/CashSales";
import TestWiseSales from "./screens/tables/FinanceTable/TestWiseSales";
import TestCountReport from "./screens/tables/FinanceTable/TestCountReport";

import SampleStatus from "./screens/tables/MedicalTable/SampleStatus";
import SampleDetails from "./screens/tables/MedicalTable/SampleDetails";

import GeographyReport from "./screens/tables/MisTable/GeographyReport";
import DynamicReport from "./screens/tables/MisTable/DymanicReport";

import DummyAnalysisScreen from "./screens/tables/InventoryTable/ConsumptionReport";

import ConsumptionReport from "./screens/tables/InventoryTable/ConsumptionReport";
import CurrentRemaining from "./screens/tables/InventoryTable/CurrentRemaining";
import MinimumQuantity from "./screens/tables/InventoryTable/MinimumQuantity";

import { Image } from "react-native";
import homebutton from "./assets/home.png";
import chat from "./assets/Chat.png";
import calendar from "./assets/calendar.png";
import profile from "./assets/Profile.png";
import PartyWiseSummary from "./screens/tables/FinanceTable/PartyWiseSummary";
import NormalReport from "./screens/tables/MedicalTable/NormalReport";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const FinanceStack = createStackNavigator();
const MedicalStack = createStackNavigator();
const MisStack = createStackNavigator();
const AnalysisStack = createStackNavigator();
const InventoryStack = createStackNavigator();

const FinanceStackNavigator = () => {
  return (
    <FinanceStack.Navigator>
      <FinanceStack.Screen name="Finance" component={FinancialScreen} />
      <FinanceStack.Screen name="TotalSales" component={TotalSales} />
      <FinanceStack.Screen name="PartyWiseSales" component={PartyWiseSales} />
      <FinanceStack.Screen
        name="PartyWiseSummary"
        component={PartyWiseSummary}
      />
      <FinanceStack.Screen
        name="RefererWiseSales"
        component={RefererWiseSales}
      />
      <FinanceStack.Screen name="CashSales" component={CashSales} />
      <FinanceStack.Screen name="TestWiseSales" component={TestWiseSales} />
      <FinanceStack.Screen name="TestCountReport" component={TestCountReport} />
    </FinanceStack.Navigator>
  );
};

const MedicalStackNavigator = () => {
  return (
    <MedicalStack.Navigator>
      <MedicalStack.Screen name="Medical" component={MedicalScreenScreen} />
      <MedicalStack.Screen name="SampleStatus" component={SampleStatus} />
      <MedicalStack.Screen name="SampleDetails" component={SampleDetails} />
      <MedicalStack.Screen name="NormalReport" component={NormalReport} />
    </MedicalStack.Navigator>
  );
};

const MisStackNavigator = () => {
  return (
    <MisStack.Navigator>
      <MisStack.Screen name="MIS" component={MISScreen} />
      <MisStack.Screen name="GeographyReport" component={GeographyReport} />
      <MisStack.Screen name="DynamicReport" component={DynamicReport} />
    </MisStack.Navigator>
  );
};

const AnalysisStackNavigator = () => {
  return (
    <AnalysisStack.Navigator>
      <AnalysisStack.Screen name="Analysis" component={AnalysisScreen} />
      <AnalysisStack.Screen name="Dummy" component={DummyAnalysisScreen} />
    </AnalysisStack.Navigator>
  );
};

const InventoryStackNavigator = () => {
  return (
    <InventoryStack.Navigator>
      <InventoryStack.Screen name="Inventory" component={InventoryScreen} />
      <InventoryStack.Screen
        name="ConsumptionReport"
        component={ConsumptionReport}
      />
      <InventoryStack.Screen
        name="CurrentRemaining"
        component={CurrentRemaining}
      />
      <InventoryStack.Screen
        name="MinimumQuantity"
        component={MinimumQuantity}
      />
    </InventoryStack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Financial"
        component={FinanceStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Medical"
        component={MedicalStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MIS"
        component={MisStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Analysis"
        component={AnalysisStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Inventory"
        component={InventoryStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    // Check if the user is logged in from async storage or any other method
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      // User is logged in
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    // If not logged in, show the login screen
    return <LoginScreen setIsLoggedIn={setIsLoggedIn} />;
  }
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconSource;

            if (route.name === "Home") {
              iconSource = homebutton;
            } else if (route.name === "Messages") {
              iconSource = chat;
            } else if (route.name === "Calendar") {
              iconSource = calendar;
            } else if (route.name === "Profile") {
              iconSource = profile;
            }

            return (
              <Image
                source={iconSource}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: color,
                }}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: "tomato",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false, tabBarLabel: "" }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ tabBarLabel: "" }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ tabBarLabel: "" }}
        />
        <Tab.Screen name="Profile" options={{ tabBarLabel: "" }}>
          {() => <ProfileScreen setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
