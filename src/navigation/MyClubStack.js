import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyClubsScreen from "../screens/MyClub/MyClubsScreen";
import ClubDetailScreen from "../screens/Club/ClubDetailScreen";
import MemberDetailScreen from "../screens/Members/MemberDetailScreen";

const Stack = createNativeStackNavigator();

export default function MyClubStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyClubsMain" component={MyClubsScreen} />
      <Stack.Screen name="ClubDetail" component={ClubDetailScreen} />
      <Stack.Screen name="MemberDetail" component={MemberDetailScreen} />
    </Stack.Navigator>
  );
}
