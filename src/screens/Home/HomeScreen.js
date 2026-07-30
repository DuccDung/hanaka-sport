import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  Alert,
  Linking,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { styles } from "./styles";
import Header from "./components/Header";
import MenuGrid from "./components/MenuGrid";
import { menuItems as baseMenuItems } from "./data/menuItems";
import { getYoutubeGuideLink } from "../../services/publicLinkService";
import { publicListTournaments } from "../../services/tournamentService";

const LOGO = require("../../../assets/home-watermark-logo.png");
const FALLBACK_TOURNAMENT_IMAGE =
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1400&q=80";

function trimText(value) {
  return String(value ?? "").trim();
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${pad2(date.getDate())}/${pad2(
    date.getMonth() + 1,
  )}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(
    date.getMinutes(),
  )}`;
}

function resolveTournamentImage(item) {
  return trimText(item?.bannerUrl) || FALLBACK_TOURNAMENT_IMAGE;
}

function getGameTypeLabel(value) {
  switch (String(value || "").toUpperCase()) {
    case "DOUBLE":
      return "Đôi";
    case "SINGLE":
      return "Đơn";
    case "MIXED":
      return "Đôi hỗn hợp";
    default:
      return trimText(value) || "-";
  }
}

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [menuItems, setMenuItems] = useState(baseMenuItems);
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [tournamentError, setTournamentError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const watermarkHeight = useMemo(() => {
    const logoSource = Image.resolveAssetSource(LOGO);
    const logoWidth = logoSource?.width || 1;
    const logoHeight = logoSource?.height || 1;

    return width * (logoHeight / logoWidth);
  }, [width]);

  const loadGuideLink = useCallback(async () => {
    try {
      const youtubeUrl = await getYoutubeGuideLink();

      setMenuItems(
        baseMenuItems.map((item) =>
          item.key === "guide"
            ? {
                ...item,
                url: youtubeUrl,
              }
            : item,
        ),
      );
    } catch (error) {
      console.log(
        "loadGuideLink error:",
        error?.response?.data || error?.message,
      );
      setMenuItems(baseMenuItems);
    }
  }, []);

  const loadTournaments = useCallback(async () => {
    try {
      setTournamentError("");
      setLoadingTournaments(true);

      const res = await publicListTournaments({
        page: 1,
        pageSize: 5,
        status: "ALL",
      });

      setTournaments(Array.isArray(res?.items) ? res.items : []);
    } catch (error) {
      console.log(
        "loadHomeTournaments error:",
        error?.response?.data || error?.message,
      );
      setTournamentError("Không tải được danh sách giải đấu.");
      setTournaments([]);
    } finally {
      setLoadingTournaments(false);
    }
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadGuideLink(), loadTournaments()]);
  }, [loadGuideLink, loadTournaments]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadAll();
    } finally {
      setRefreshing(false);
    }
  }, [loadAll]);

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

  const renderTournamentCard = (item) => {
    const startTimeText = formatDateTime(item.startTime);
    const deadlineText = formatDateTime(item.registerDeadline);
    const imageUri = resolveTournamentImage(item);
    const gameTypeLabel = getGameTypeLabel(item.gameType);

    return (
      <Pressable
        key={String(item.tournamentId)}
        style={({ pressed }) => [
          styles.tournamentCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() =>
          navigation.navigate("TournamentDetail", {
            tournamentId: item.tournamentId,
            preview: item,
          })
        }
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.tournamentImage}
          resizeMode="cover"
        />

        <View style={styles.tournamentBody}>
          <Text style={styles.tournamentTitle} numberOfLines={3}>
            {trimText(item.title) || "Giải đấu Hanaka Sport"}
          </Text>

          <Text style={styles.tournamentInfoText}>
            Ngày:{" "}
            <Text style={styles.tournamentStrong}>
              {startTimeText || "-"}
            </Text>
          </Text>

          <Text style={styles.tournamentInfoText}>
            Hạn đăng ký:{" "}
            <Text style={styles.tournamentStrong}>{deadlineText || "-"}</Text>
          </Text>

          <View style={styles.tournamentInfoRow}>
            <Text
              style={[
                styles.tournamentInfoText,
                styles.tournamentInfoLeft,
              ]}
            >
              Thể thức:{" "}
              <Text style={styles.tournamentStrong}>
                {trimText(item.formatText) || "-"}
              </Text>
            </Text>

            <Text
              style={[
                styles.tournamentInfoText,
                styles.tournamentInfoRight,
              ]}
            >
              Giải: <Text style={styles.tournamentStrong}>{gameTypeLabel}</Text>
            </Text>
          </View>

          <View style={styles.tournamentInfoRow}>
            <Text
              style={[
                styles.tournamentInfoText,
                styles.tournamentInfoLeft,
              ]}
            >
              Giới hạn trình đơn tối đa:{" "}
              <Text style={styles.tournamentStrong}>
                {item.singleLimit ?? 0}
              </Text>
            </Text>

            <Text
              style={[
                styles.tournamentInfoText,
                styles.tournamentInfoRight,
              ]}
            >
              Cấp tối đa:{" "}
              <Text style={styles.tournamentStrong}>
                {item.doubleLimit ?? 0}
              </Text>
            </Text>
          </View>

          <Text style={styles.tournamentInfoText}>
            Khu vực:{" "}
            <Text style={styles.tournamentStrong}>
              {trimText(item.areaText) || "-"}
            </Text>
          </Text>

          <View style={styles.tournamentInfoRow}>
            <Text
              style={[
                styles.tournamentInfoText,
                styles.tournamentInfoLeft,
              ]}
            >
              Số đội dự kiến:{" "}
              <Text style={styles.tournamentStrong}>
                {item.expectedTeams ?? 0}
              </Text>
            </Text>

            <Text
              style={[
                styles.tournamentInfoText,
                styles.tournamentInfoRight,
              ]}
            >
              Số trận thi đấu:{" "}
              <Text style={styles.tournamentStrong}>
                {item.matchesCount ?? 0}
              </Text>
            </Text>
          </View>

          <Text style={styles.tournamentInfoText}>
            Tình trạng:{" "}
            <Text style={styles.tournamentStrong}>
              {trimText(item.stateText) || trimText(item.status) || "-"}
            </Text>
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.safe}>
      <View
        style={styles.headerMeasureWrap}
        onLayout={(event) => {
          const nextHeight = Math.round(event.nativeEvent.layout.height);
          setHeaderHeight((current) =>
            current === nextHeight ? current : nextHeight,
          );
        }}
      >
        <Header
          onPressAvatar={() =>
            navigation.navigate("AuthStack", {
              screen: "Login",
            })
          }
        />
      </View>

      <View
        style={[
          styles.watermarkLayer,
          {
            top: headerHeight,
            opacity: headerHeight > 0 ? 1 : 0,
          },
        ]}
        pointerEvents="none"
      >
        <Image
          source={LOGO}
          style={[
            styles.watermarkLogo,
            {
              width,
              height: watermarkHeight,
            },
          ]}
          resizeMode="contain"
          blurRadius={2}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MenuGrid items={menuItems} onPressItem={handlePressItem} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Các giải đấu Hanaka</Text>
        </View>

        {loadingTournaments ? (
          <View style={styles.sectionStateCard}>
            <ActivityIndicator size="small" color="#0A66C2" />
            <Text style={styles.sectionStateText}>Đang tải giải đấu...</Text>
          </View>
        ) : tournamentError ? (
          <View style={styles.sectionStateCard}>
            <Text style={styles.sectionErrorText}>{tournamentError}</Text>
            <Pressable style={styles.retryButton} onPress={loadTournaments}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </Pressable>
          </View>
        ) : tournaments.length > 0 ? (
          <View style={styles.tournamentList}>
            {tournaments.map(renderTournamentCard)}
          </View>
        ) : (
          <View style={styles.sectionStateCard}>
            <Text style={styles.sectionStateText}>
              Hiện chưa có giải đấu để hiển thị.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
