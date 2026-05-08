import React from "react";
import { Image, Pressable, View, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { styles } from "../styles";

const { width } = Dimensions.get("window");
const LOGO = require("../../../../assets/logo.png");

export default function MenuGrid({ items = [], onPressItem }) {
  const MENU_SIZE = Math.min(width - 32, 360);
  const BUTTON_SIZE = MENU_SIZE <= 330 ? 68 : 74;
  const CENTER = MENU_SIZE / 2;
  const RADIUS = MENU_SIZE / 2 - BUTTON_SIZE / 2 - 8;
  const totalItems = items.length || 1;

  return (
    <View
      style={[
        styles.radialMenu,
        {
          width: MENU_SIZE,
          height: MENU_SIZE,
        },
      ]}
    >
      <View style={styles.radialRing} />

      <View style={styles.radialCenter}>
        <Image source={LOGO} style={styles.radialLogo} resizeMode="cover" />
      </View>

      {items.map((item, index) => {
        const angle = -90 + (360 / totalItems) * index;
        const radian = (Math.PI / 180) * angle;
        const left = CENTER + RADIUS * Math.cos(radian) - BUTTON_SIZE / 2;
        const top = CENTER + RADIUS * Math.sin(radian) - BUTTON_SIZE / 2;

        return (
          <Pressable
            key={item.key}
            onPress={() => onPressItem?.(item)}
            style={({ pressed }) => [
              styles.radialButton,
              {
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                borderRadius: BUTTON_SIZE / 2,
                left,
                top,
              },
              pressed && styles.menuItemPressed,
            ]}
          >
            <View style={styles.radialIconWrap}>
              <Ionicons name={item.icon} size={22} color={COLORS.WHITE} />
            </View>

            <Text style={styles.radialLabel} numberOfLines={2}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
