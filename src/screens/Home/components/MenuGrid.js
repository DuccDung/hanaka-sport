import React from "react";
import { Pressable, View, Text, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { styles } from "../styles";

export default function MenuGrid({ items = [], onPressItem }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  const compact = width < 380;
  const horizontalPadding = 32;
  const gap = isWide ? 15 : compact ? 8 : 10;
  const itemSize = Math.floor((width - horizontalPadding - gap * 3) / 4);
  const cardHeight = isWide ? 132 : compact ? 86 : 92;
  const iconSize = isWide ? 52 : compact ? 36 : 40;
  const labelSize = isWide ? 17 : compact ? 11 : 13;

  return (
    <View style={[styles.menuGrid, { gap }]}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onPressItem?.(item)}
          style={({ pressed }) => [
            styles.menuCard,
            {
              width: itemSize,
              minHeight: cardHeight,
              paddingVertical: isWide ? 22 : 12,
            },
            pressed && styles.menuItemPressed,
          ]}
        >
          <View
            style={[
              styles.menuIconWrap,
              {
                width: iconSize,
                height: iconSize,
                borderRadius: iconSize / 2,
              },
            ]}
          >
            <Ionicons name={item.icon} size={iconSize * 0.46} color={COLORS.WHITE} />
          </View>

          <Text
            style={[styles.menuLabel, { fontSize: labelSize }]}
            numberOfLines={2}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
