import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabs from "./MainTabs";
import VideoPlayerScreen from "../screens/Videos/VideoPlayerScreen";

const Root = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        <Root.Screen name="MainTabs" component={MainTabs} />
        <Root.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
