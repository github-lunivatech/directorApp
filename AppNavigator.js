// AppNavigator.js
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "./screens/login/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import FinancialScreen from "./screens/FinancialScreen";
import AuthLoadingScreen from "./AuthLoadingScreen";
import InventoryScreen from "./screens/InventoryScreen";
import MedicalScreenScreen from "./screens/MedicalScreen";
import AnalysisScreen from "./screens/AnalysisScreen";
import MISScreen from "./screens/MISScreen";
import Setting from "./screens/SettingScreen";
import theme from "./theme";
import MedicalTable from "./screens/tables/MedicalTable";
import CashSales from "./screens/tables/FinanceTable/CashSales";
import PartyWiseSales from "./screens/tables/FinanceTable/PartyWiseSales";
import RefererWiseSales from "./screens/tables/FinanceTable/RefererWiseSales";
import TestCountReport from "./screens/tables/FinanceTable/TestCountReport";
import TestWiseSales from "./screens/tables/FinanceTable/TestWiseSales";
import TotalSales from "./screens/tables/FinanceTable/TotalSales";
import DynamicReport from "./screens/tables/MisTable/DymanicReport";
import ConsumptionReport from "./screens/tables/InventoryTable/ConsumptionReport";
import GeographyReport from "./screens/tables/MisTable/GeographyReport";

import BottomTabNavigator from "./BottomTabNavigator";

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: theme.primaryColor, // Set your desired header color
      },
      headerTintColor: "white", // Set your desired text color
    },
  }
);

const AppStack = createStackNavigator(
  {
    Home: HomeScreen,

    Financial: FinancialScreen,
    MIS: MISScreen,
    Analysis: AnalysisScreen,
    Medical: MedicalScreenScreen,
    Inventory: InventoryScreen,
    Setting: Setting,

    TotalSales: TotalSales,
    PartyWiseSales: PartyWiseSales,
    RefererWiseSales: RefererWiseSales,
    CashSales: CashSales,
    TestWiseSales: TestWiseSales,
    TestCountReport: TestCountReport,

    MedicalTable: MedicalTable,

    GeographyReport: GeographyReport,
    DymanicReport: DynamicReport,

    ConsumptionReport: ConsumptionReport,
  },
  {
    tabBarComponent: BottomTabNavigator,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#fff",
      },
      headerTintColor: "black",
    },
  }
);

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppStack,
  },
  {
    initialRouteName: "AuthLoading",
  }
);
AppStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};
export default createAppContainer(AppNavigator);
