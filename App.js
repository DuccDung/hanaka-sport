import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

const BLUE = "#2E57A7";
const BG = "#EEF2F8";

function Placeholder({ title }) {
  return (
    <View style={[styles.center, { backgroundColor: BG }]}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{title}</Text>
    </View>
  );
}

/** Header dùng chung (status bar + vùng tai thỏ cùng màu) */
function Header({ sport, onToggleSport }) {
  return (
    <>
      {/* iOS: tô nền vùng safe area (tai thỏ) */}
      <SafeAreaView style={{ backgroundColor: BLUE }} />
      {/* Android: set màu status bar */}
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      <View style={styles.header}>
        <Pressable style={styles.sportPicker} onPress={onToggleSport}>
          <Ionicons name="tennisball-outline" size={18} color="#fff" />
          <Text style={styles.sportText}>{sport}</Text>
          <Ionicons name="chevron-down" size={18} color="#fff" />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </Pressable>

          <View style={styles.avatar}>
            <Ionicons name="person" size={18} color={BLUE} />
          </View>
        </View>
      </View>
    </>
  );
}

function MenuGrid({ items }) {
  const NUM_COLS = 4;
  const GAP = 12; // khoảng cách giữa item
  const CONTAINER_W = width - 32; // vì body padding 16 * 2 = 32
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
            onPress={() => {}}
            style={[
              styles.menuItem,
              {
                width: ITEM_W,
                marginRight: isLastInRow ? 0 : GAP,
              },
            ]}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={20} color={BLUE} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </Pressable>
        );
      }}
    />
  );
}

function BannerCarousel({ banners, index, onChangeIndex }) {
  const onBannerScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (width - 32));
    onChangeIndex(idx);
  };

  return (
    <>
      <Text style={styles.sectionTitle}>{banners[index]?.title}</Text>

      <View style={styles.bannerCard}>
        <FlatList
          data={banners}
          keyExtractor={(b) => b.key}
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

function HomeScreen() {
  const [sport, setSport] = useState("Pickleball");
  const [bannerIndex, setBannerIndex] = useState(0);
  const toggleSport = () =>
    setSport((s) => (s === "Pickleball" ? "Tennis" : "Pickleball"));

  const menuItems = useMemo(
    () => [
      { key: "rules", label: "Luật Chơi", icon: "newspaper-outline" },
      { key: "guide", label: "Hướng\nDẫn", icon: "bookmark-outline" },
      { key: "members", label: "Thành\nviên", icon: "people-outline" },
      { key: "club", label: "CLB", icon: "headset-outline" },

      { key: "coach", label: "HL Viên", icon: "easel-outline" },
      { key: "court", label: "Sân Bãi", icon: "bed-outline" },
      { key: "ref", label: "Trọng Tài", icon: "scale-outline" },

      { key: "tournament", label: "Giải đấu", icon: "medal-outline" },
      { key: "exchange", label: "Giao lưu", icon: "hand-left-outline" },
      { key: "match", label: "Trận đấu", icon: "close-outline" },
    ],
    [],
  );

  const banners = useMemo(
    () => [
      {
        key: "b1",
        title: "CÔNG TY CỔ PHẦN THỂ THAO KOJI - Tài trợ",
        image: "https://picsum.photos/1000/500?random=11",
      },
      {
        key: "b2",
        title: "Kaitashi - Tài trợ",
        image: "https://picsum.photos/1000/500?random=12",
      },
      {
        key: "b3",
        title: "Zocker - Tài trợ",
        image: "https://picsum.photos/1000/500?random=13",
      },
    ],
    [],
  );

  return (
    <View style={styles.safe}>
      <Header sport={sport} onToggleSport={toggleSport} />
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <MenuGrid items={menuItems} />
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#FFD54A",
          tabBarInactiveTintColor: "#E5ECFF",
          tabBarStyle: {
            backgroundColor: BLUE,
            height: 80,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarIcon: ({ color, size, focused }) => {
            const map = {
              Home: focused ? "home" : "home-outline",
              Videos: focused ? "play-circle" : "play-circle-outline",
              CLB: focused ? "copy" : "copy-outline",
              Chat: focused ? "chatbubbles" : "chatbubbles-outline",
              Contacts: focused ? "people" : "people-outline",
            };
            return (
              <Ionicons name={map[route.name]} size={size} color={color} />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Trang Chủ" }}
        />
        <Tab.Screen
          name="Videos"
          component={() => <Placeholder title="Videos" />}
          options={{ title: "Videos" }}
        />
        <Tab.Screen
          name="CLB"
          component={() => <Placeholder title="CLB" />}
          options={{ title: "CLB" }}
        />
        <Tab.Screen
          name="Chat"
          component={() => <Placeholder title="Tin nhắn" />}
          options={{ title: "Tin nhắn" }}
        />
        <Tab.Screen
          name="Contacts"
          component={() => <Placeholder title="Danh bạ" />}
          options={{ title: "Danh bạ" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  body: { padding: 16 },

  header: {
    backgroundColor: BLUE,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sportPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 170,
  },
  sportText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcon: { padding: 6 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5ECFF",
    alignItems: "center",
    justifyContent: "center",
  },

  menuItem: {
    alignItems: "center",
    marginBottom: 18,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 29,
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  menuLabel: {
    textAlign: "center",
    color: "#434446",
    fontSize: 12,
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 10,
    color: "#1E2430",
  },

  bannerCard: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  bannerImage: { width: width - 32, height: 200 },
  dots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  dotActive: { backgroundColor: "#fff" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
