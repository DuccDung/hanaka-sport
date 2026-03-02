import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { styles } from "./styles";
import Header from "./components/Header";
import MenuGrid from "./components/MenuGrid";
import BannerCarousel from "./components/BannerCarousel";
import { menuItems } from "./data/menuItems";
import { banners } from "./data/banners";

export default function HomeScreen({ navigation }) {
  const [sport, setSport] = useState("Pickleball");
  const [bannerIndex, setBannerIndex] = useState(0);

  const toggleSport = () =>
    setSport((s) => (s === "Pickleball" ? "Tennis" : "Pickleball"));

  const handlePressItem = (item) => {
    if (item.key === "rules") navigation.navigate("Rules");
    if (item.key === "members") navigation.navigate("Members");
    if (item.key === "coach") navigation.navigate("Coach");
    if (item.key === "club") navigation.navigate("Club");
    if (item.key === "court") navigation.navigate("Court");
    if (item.key === "ref") navigation.navigate("Referee");
    if (item.key === "tournament") navigation.navigate("Tournament");
    if (item.key === "exchange") navigation.navigate("Exchange");
    if (item.key === "match") navigation.navigate("MatchList");
  };
  return (
    <View style={styles.safe}>
      <Header sport={sport} onToggleSport={toggleSport} />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <MenuGrid items={menuItems} onPressItem={handlePressItem} />
        <BannerCarousel
          banners={banners}
          index={bannerIndex}
          onChangeIndex={setBannerIndex}
        />
        <BannerCarousel
          banners={banners}
          index={bannerIndex}
          onChangeIndex={setBannerIndex}
        />
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
