import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/HomeScreen";
import RulesScreen from "../screens/Rules/RulesScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Rules"
        component={RulesScreen}
        options={({ navigation }) => ({
          title: "Luật Chơi",
          headerTitleStyle: { fontWeight: "800" },

          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 0 }}
            >
              <Ionicons name="chevron-back" size={26} color="#007AFF" />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
