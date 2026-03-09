import React from "react";
import { FlatList, Pressable, View, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { styles } from "../styles";

const { width } = Dimensions.get("window");

export default function MenuGrid({ items = [], onPressItem }) {
  const NUM_COLS = 4;
  const GAP = 12;
  const CONTAINER_W = width - 32;
  const ITEM_W = (CONTAINER_W - GAP * (NUM_COLS - 1)) / NUM_COLS;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.key}
      numColumns={NUM_COLS}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{ justifyContent: "flex-start" }}
      contentContainerStyle={{ paddingBottom: 4 }}
      renderItem={({ item, index }) => {
        const isLastInRow = (index + 1) % NUM_COLS === 0;

        return (
          <View
            style={[
              styles.menuItemOuter,
              {
                width: ITEM_W,
                marginRight: isLastInRow ? 0 : GAP,
              },
            ]}
          >
            <Pressable
              onPress={() => onPressItem?.(item)}
              style={({ pressed }) => [
                styles.menuItemInner,
                pressed && styles.menuItemPressed,
              ]}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon} size={22} color={COLORS.WHITE} />
              </View>

              <Text style={styles.menuLabel} numberOfLines={2}>
                {item.label}
              </Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}
