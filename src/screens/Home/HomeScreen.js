import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  Alert,
  Linking,
} from "react-native";
import { styles } from "./styles";
import Header from "./components/Header";
import MenuGrid from "./components/MenuGrid";
import BannerCarousel from "./components/BannerCarousel";
import { menuItems as baseMenuItems } from "./data/menuItems";
import { getHomeBanners } from "../../services/bannerService";
import { getYoutubeGuideLink } from "../../services/publicLinkService";

export default function HomeScreen({ navigation }) {
  const [sport, setSport] = useState("Pickleball");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [bannerError, setBannerError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [menuItems, setMenuItems] = useState(baseMenuItems);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([loadGuideLink(), loadBanners()]);
  };

  const loadGuideLink = async () => {
    try {
      setLoadingMenu(true);

      const youtubeUrl = await getYoutubeGuideLink();

      const nextItems = baseMenuItems.map((item) => {
        if (item.key === "guide") {
          return {
            ...item,
            url: youtubeUrl,
          };
        }
        return item;
      });

      setMenuItems(nextItems);
    } catch (error) {
      console.log(
        "loadGuideLink error:",
        error?.response?.data || error?.message,
      );
      setMenuItems(baseMenuItems);
    } finally {
      setLoadingMenu(false);
    }
  };

  const loadBanners = async () => {
    try {
      setBannerError("");

      const items = await getHomeBanners();
      setBanners(items || []);
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
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const toggleSport = () => {
    setSport((prev) => (prev === "Pickleball" ? "Tennis" : "Pickleball"));
  };

  const openUrl = async (url) => {
    if (!url) {
      Alert.alert("Thông báo", "Chưa có liên kết hướng dẫn.");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert("Thông báo", "Không thể mở liên kết hướng dẫn.");
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Thông báo", "Mở liên kết thất bại.");
    }
  };

  const handlePressItem = async (item) => {
    if (item.key === "guide") {
      await openUrl(item.url);
      return;
    }

    if (item.key === "rules") {
      navigation.navigate("Rules");
      return;
    }

    if (item.key === "members") {
      navigation.navigate("Members");
      return;
    }

    if (item.key === "coach") {
      navigation.navigate("Coach");
      return;
    }

    if (item.key === "club") {
      navigation.navigate("Club");
      return;
    }

    if (item.key === "court") {
      navigation.navigate("Court");
      return;
    }

    if (item.key === "ref") {
      navigation.navigate("Referee");
      return;
    }

    if (item.key === "tournament") {
      navigation.navigate("Tournament");
      return;
    }

    if (item.key === "exchange") {
      navigation.navigate("Exchange");
      return;
    }

    if (item.key === "match") {
      navigation.navigate("MatchList");
    }
  };

  return (
    <View style={styles.safe}>
      <Header
        sport={sport}
        onToggleSport={toggleSport}
        onPressAvatar={() =>
          navigation.navigate("AuthStack", {
            screen: "Login",
          })
        }
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loadingMenu ? (
          <View style={styles.bannerLoadingWrap}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <MenuGrid items={menuItems} onPressItem={handlePressItem} />
        )}

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
