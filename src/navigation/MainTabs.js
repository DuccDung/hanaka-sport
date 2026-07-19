import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import VideosScreen from "../screens/Videos/VideosScreen";
import HomeStack from "./HomeStack";
import ChatStack from "./ChatStack";
import TournamentStack from "./TournamentStack";
import CourtStack from "./CourtStack";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

const TAB_LABELS = {
  Home: "Trang Ch\u1ee7",
  Videos: "Video",
  TournamentTab: "Gi\u1ea3i \u0110\u1ea5u",
  Chat: "Tr\u00f2 chuy\u1ec7n",
  CourtTab: "S\u00e2n B\u00e3i",
};

const TAB_ICONS = {
  Home: { active: "home", inactive: "home-outline" },
  Videos: { active: "play-circle", inactive: "play-circle-outline" },
  TournamentTab: { active: "trophy", inactive: "trophy-outline" },
  Chat: { active: "chatbubbles", inactive: "chatbubbles-outline" },
  CourtTab: { active: "location", inactive: "location-outline" },
};

const TAB_BAR_HEIGHT = 62;
const TAB_BAR_TOP_GAP = 10;

function FloatingTabBar({
  state,
  descriptors,
  navigation,
  bottomInset,
  reservedHeight,
}) {
  return (
    <View style={[styles.floatingWrap, { height: reservedHeight }]}>
      <View style={[styles.tabBar, { bottom: bottomInset }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key]?.options || {};
          const label = options.title || TAB_LABELS[route.name] || route.name;
          const icon = TAB_ICONS[route.name] || TAB_ICONS.Home;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tabItem,
                pressed && styles.tabItemPressed,
              ]}
            >
              <Ionicons
                name={focused ? icon.active : icon.inactive}
                size={focused ? 20 : 19}
                color={focused ? "#FFFFFF" : "rgba(229,242,255,0.9)"}
              />
              <Text
                allowFontScaling={false}
                adjustsFontSizeToFit
                minimumFontScale={0.78}
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  focused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function MainTabs() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom - 10, 12);
  const tabBarReservedHeight = TAB_BAR_HEIGHT + TAB_BAR_TOP_GAP + tabBarBottom;
  const navigatorKey = session?.accessToken
    ? `auth:${session?.user?.userId || session.accessToken}`
    : "guest";

  return (
    <Tab.Navigator
      key={navigatorKey}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => (
        <FloatingTabBar
          {...props}
          bottomInset={tabBarBottom}
          reservedHeight={tabBarReservedHeight}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: TAB_LABELS.Home }}
      />
      <Tab.Screen
        name="Videos"
        component={VideosScreen}
        options={{ title: TAB_LABELS.Videos }}
      />
      <Tab.Screen
        name="TournamentTab"
        component={TournamentStack}
        options={{ title: TAB_LABELS.TournamentTab }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ title: TAB_LABELS.Chat }}
      />
      <Tab.Screen
        name="CourtTab"
        component={CourtStack}
        options={{ title: TAB_LABELS.CourtTab }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  floatingWrap: {
    backgroundColor: "transparent",
  },

  tabBar: {
    position: "absolute",
    left: 18,
    right: 18,
    height: TAB_BAR_HEIGHT,
    borderRadius: 24,
    backgroundColor: "#1776D2",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    shadowColor: "#064A8C",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.34,
    shadowRadius: 24,
    elevation: 18,
  },

  tabItem: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 2,
  },

  tabItemPressed: {
    opacity: 0.88,
  },

  tabLabel: {
    width: "100%",
    maxWidth: 68,
    textAlign: "center",
    fontSize: 10.5,
    lineHeight: 12,
    letterSpacing: 0,
  },

  tabLabelActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  tabLabelInactive: {
    color: "rgba(229,242,255,0.86)",
    fontWeight: "700",
  },
});
