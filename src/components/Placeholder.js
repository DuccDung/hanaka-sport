import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../constants/colors";

export default function Placeholder({ title }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.BG,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{title}</Text>
    </View>
  );
}
