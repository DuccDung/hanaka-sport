import React from "react";
import { FlatList, Pressable, View, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { styles } from "../styles";

const { width } = Dimensions.get("window");

export default function MenuGrid({ items, onPressItem }) {
  const NUM_COLS = 4;
  const GAP = 12;
  const CONTAINER_W = width - 32; // body padding 16*2
  const ITEM_W = (CONTAINER_W - GAP * (NUM_COLS - 1)) / NUM_COLS;

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.key}
      numColumns={NUM_COLS}
      scrollEnabled={false}
      columnWrapperStyle={{ justifyContent: "flex-start" }}
      renderItem={({ item, index }) => {
        const isLastInRow = (index + 1) % NUM_COLS === 0;

        return (
          <Pressable
            onPress={() => onPressItem?.(item)}
            style={[
              styles.menuItem,
              { width: ITEM_W, marginRight: isLastInRow ? 0 : GAP },
            ]}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={20} color={COLORS.BLUE} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </Pressable>
        );
      }}
    />
  );
}
