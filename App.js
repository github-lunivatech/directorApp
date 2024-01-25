import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import AppNavigator from "./AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
