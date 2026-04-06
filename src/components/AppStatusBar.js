import React from "react";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";

export default function AppStatusBar({
  backgroundColor,
  barStyle = "light-content",
}) {
  const androidInset =
    Platform.OS === "android"
      ? Math.min(StatusBar.currentHeight || 0, 24)
      : 0;

  return (
    <>
      {Platform.OS === "android" ? (
        <View style={{ height: androidInset, backgroundColor }} />
      ) : (
        <SafeAreaView style={{ backgroundColor }} />
      )}
      <StatusBar
        animated
        barStyle={barStyle}
        backgroundColor={backgroundColor}
        translucent={false}
      />
    </>
  );
}
