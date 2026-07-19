import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CourtScreen from "../screens/Court/CourtScreen";
import CourtDetailScreen from "../screens/Court/CourtDetailScreen";

const Stack = createNativeStackNavigator();

export default function CourtStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourtMain" component={CourtScreen} />
      <Stack.Screen name="CourtDetail" component={CourtDetailScreen} />
    </Stack.Navigator>
  );
}
