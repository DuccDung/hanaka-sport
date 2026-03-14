import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClubChatListScreen from "../screens/Chat/ClubChatListScreen";
import ClubChatRoomScreen from "../screens/Chat/ClubChatRoomScreen";

const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClubChatList" component={ClubChatListScreen} />
      <Stack.Screen name="ClubChatRoom" component={ClubChatRoomScreen} />
    </Stack.Navigator>
  );
}
