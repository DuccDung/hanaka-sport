import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

import VideosScreen from "../screens/Videos/VideosScreen";
import Placeholder from "../components/Placeholder";
import HomeStack from "./HomeStack";
import MyClubsScreen from "../screens/MyClub/MyClubsScreen";
const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#E5ECFF",
        tabBarStyle: {
          backgroundColor: COLORS.BLUE,
          height: 80,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const map = {
            Home: focused ? "home" : "home-outline",
            Videos: focused ? "play-circle" : "play-circle-outline",
            CLB: focused ? "copy" : "copy-outline",
            Chat: focused ? "chatbubbles" : "chatbubbles-outline",
            Contacts: focused ? "people" : "people-outline",
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: "Trang Chủ" }}
      />
      <Tab.Screen
        name="Videos"
        component={VideosScreen}
        options={{ title: "Videos" }}
      />
      <Tab.Screen
        name="CLB"
        component={MyClubsScreen}
        options={{ title: "CLB" }}
      />
      <Tab.Screen
        name="Chat"
        component={() => <Placeholder title="Tin nhắn" />}
        options={{ title: "Tin nhắn" }}
      />
    </Tab.Navigator>
  );
}
