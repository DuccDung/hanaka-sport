import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppStatusBar({
  backgroundColor,
  barStyle = "light-content",
}) {
  return (
    <>
      <SafeAreaView style={{ backgroundColor }} edges={["top"]} />
      <StatusBar
        animated
        barStyle={barStyle}
        backgroundColor={backgroundColor}
        translucent={false}
      />
    </>
  );
}
