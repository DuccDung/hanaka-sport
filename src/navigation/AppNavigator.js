import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabs from "./MainTabs";
import AuthStack from "./AuthStack";

import VideoPlayerScreen from "../screens/Videos/VideoPlayerScreen";
import AccountScreen from "../screens/Account/AccountScreen";
import ChangePasswordScreen from "../screens/Account/ChangePasswordScreen";
import SettingsScreen from "../screens/Setting/SettingsScreen";
import NotificationScreen from "../screens/Setting/NotificationScreen";
import GuideScreen from "../screens/Setting/GuideScreen";
import WebViewScreen from "../screens/Setting/WebViewScreen";

const Root = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Root.Navigator
        initialRouteName="MainTabs"
        screenOptions={{ headerShown: false }}
      >
        {/* Main app cho khách xem trước */}
        <Root.Screen name="MainTabs" component={MainTabs} />

        {/* Auth */}
        <Root.Screen name="AuthStack" component={AuthStack} />

        {/* Global screens */}
        <Root.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Root.Screen name="Account" component={AccountScreen} />
        <Root.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Root.Screen name="Settings" component={SettingsScreen} />
        <Root.Screen name="Notification" component={NotificationScreen} />
        <Root.Screen name="Guide" component={GuideScreen} />
        <Root.Screen name="AppWebView" component={WebViewScreen} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
