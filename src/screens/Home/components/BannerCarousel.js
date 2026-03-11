import React from "react";
import { View, Text, FlatList, Image, Dimensions } from "react-native";
import { styles } from "../styles";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

export default function BannerCarousel({
  banners = [],
  index = 0,
  onChangeIndex,
}) {
  const onBannerScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / CARD_WIDTH);
    onChangeIndex?.(idx);
  };

  if (!banners.length) {
    return null;
  }

  return (
    <>
      <Text style={styles.sectionTitle}>{banners[index]?.title || ""}</Text>

      <View style={styles.bannerCard}>
        <FlatList
          data={banners}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onBannerScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}
        />

        <View style={styles.dots}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      </View>
    </>
  );
}
