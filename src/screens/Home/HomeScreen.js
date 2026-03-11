import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { styles } from "./styles";
import Header from "./components/Header";
import MenuGrid from "./components/MenuGrid";
import BannerCarousel from "./components/BannerCarousel";
import { menuItems } from "./data/menuItems";
import { getHomeBanners } from "../../services/bannerService";

export default function HomeScreen({ navigation }) {
  const [sport, setSport] = useState("Pickleball");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerError, setBannerError] = useState("");

  useEffect(() => {
    loadBanners();
  }, []);

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

  async function loadBanners() {
    try {
      setBannerError("");
      const items = await getHomeBanners();
      setBanners(items);
      setBannerIndex(0);
    } catch (error) {
      console.log(
        "loadBanners error:",
        error?.response?.data || error?.message,
      );
      setBannerError("Không tải được banner từ máy chủ.");
      setBanners([]);
      setBannerIndex(0);
    } finally {
      setLoadingBanners(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadBanners();
  }

  return (
    <View style={styles.safe}>
      <Header
        sport={sport}
        onToggleSport={toggleSport}
        onPressAvatar={() => navigation.navigate("Login")}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MenuGrid items={menuItems} onPressItem={handlePressItem} />

        {loadingBanners ? (
          <View style={styles.bannerLoadingWrap}>
            <ActivityIndicator size="large" />
          </View>
        ) : bannerError ? (
          <View style={styles.bannerErrorWrap}>
            <Text style={styles.bannerErrorText}>{bannerError}</Text>
          </View>
        ) : banners.length > 0 ? (
          <BannerCarousel
            banners={banners}
            index={bannerIndex}
            onChangeIndex={setBannerIndex}
          />
        ) : (
          <View style={styles.bannerEmptyWrap}>
            <Text style={styles.bannerEmptyText}>Hiện chưa có banner.</Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
