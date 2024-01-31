import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import AppNavigator from "./AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomTabNavigator from "./BottomTabNavigator";

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <BottomTabNavigator />
      {/* <AppNavigator /> */}
    </SafeAreaProvider>
  );
};

export default App;
