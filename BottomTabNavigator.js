import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

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

import MedicalTable from "./screens/tables/MedicalTable";

import GeographyReport from "./screens/tables/MisTable/GeographyReport";
import DynamicReport from "./screens/tables/MisTable/DymanicReport";

import DummyAnalysisScreen from "./screens/tables/InventoryTable/ConsumptionReport";

import ConsumptionReport from "./screens/tables/InventoryTable/ConsumptionReport";

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
      <MedicalStack.Screen name="MedicalTable" component={MedicalTable} />
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
      {/* Add more screens for Analysis as needed */}
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
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Messages") {
              iconName = "envelope";
            } else if (route.name === "Calendar") {
              iconName = "calendar";
            } else if (route.name === "Profile") {
              iconName = "user";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "orange", // Set the active color to orange
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
