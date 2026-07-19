import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatHomeScreen from "../screens/Chat/ChatHomeScreen";
import ClubChatListScreen from "../screens/Chat/ClubChatListScreen";
import ClubChatRoomScreen from "../screens/Chat/ClubChatRoomScreen";
import DirectChatSearchScreen from "../screens/Chat/DirectChatSearchScreen";
import DirectChatRoomScreen from "../screens/Chat/DirectChatRoomScreen";

const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatHome" component={ChatHomeScreen} />
      <Stack.Screen name="ClubChatList" component={ClubChatListScreen} />
      <Stack.Screen name="ClubChatRoom" component={ClubChatRoomScreen} />
      <Stack.Screen name="DirectChatSearch" component={DirectChatSearchScreen} />
      <Stack.Screen name="DirectChatRoom" component={DirectChatRoomScreen} />
    </Stack.Navigator>
  );
}
