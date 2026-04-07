import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

import VideosScreen from "../screens/Videos/VideosScreen";
import HomeStack from "./HomeStack";
import MyClubStack from "./MyClubStack";
import ChatStack from "./ChatStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);
  const tabBarHeight = 56 + bottomInset;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(229,236,255,0.78)",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarStyle: {
          backgroundColor: COLORS.BLUE,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const map = {
            Home: focused ? "home" : "home-outline",
            Videos: focused ? "play-circle" : "play-circle-outline",
            CLB: focused ? "copy" : "copy-outline",
            Chat: focused ? "chatbubbles" : "chatbubbles-outline",
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
        component={MyClubStack}
        options={{ title: "CLB" }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ title: "Tin nhắn" }}
      />
    </Tab.Navigator>
  );
}
