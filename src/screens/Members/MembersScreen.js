import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  TextInput,
  FlatList,
  Image,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { getMembers } from "../../services/userService";
import { COLORS } from "../../constants/colors";

export default function MembersScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

  const canLoadMore = useMemo(
    () => items.length < total,
    [items.length, total],
  );

  const fetchMembers = async ({ reset = false } = {}) => {
    try {
      setLoading(true);
      const nextPage = reset ? 1 : page;

      const res = await getMembers({
        query: submittedQuery.trim(),
        page: nextPage,
        pageSize,
      });

      setTotal(res.total || 0);

      if (reset) {
        setItems(res.items || []);
        setPage(2);
      } else {
        setItems((prev) => [...prev, ...(res.items || [])]);
        setPage((p) => p + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQuery]);

  const onSearch = () => {
    Keyboard.dismiss();
    setSubmittedQuery(query);
  };

  const renderItem = ({ item }) => {
    const hasAvatar =
      !!item.avatarUrl && String(item.avatarUrl).trim().length > 0;

    return (
      <Pressable
        style={styles.item}
        onPress={() =>
          navigation.navigate("MemberDetail", { userId: item.userId })
        }
      >
        {/* Avatar: có ảnh thì Image, không có thì icon */}
        {hasAvatar ? (
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              {
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EEF2FF",
              },
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={46}
              color={COLORS.BLUE}
            />
          </View>
        )}

        <View style={styles.mid}>
          <Text style={styles.name}>{item.fullName}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>ID: {item.userId}</Text>
            <Text style={styles.meta}>{item.city || "—"}</Text>
          </View>

          <View style={styles.subRow}>
            <Text style={styles.gender}>{item.gender || "—"}</Text>

            {/* Verified: true xanh, false đỏ */}
            <Text
              style={[
                styles.verified,
                { color: item.verified ? "#16A34A" : "#DC2626" },
              ]}
            >
              {item.verified ? "Đã xác thực" : "Chưa xác thực"}
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.score}>
            {item.ratingSingle != null
              ? Number(item.ratingSingle).toFixed(2)
              : "0.00"}
          </Text>
          <Text style={styles.score}>
            {item.ratingDouble != null
              ? Number(item.ratingDouble).toFixed(2)
              : "0.00"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>

          <Text style={styles.headerTitle}>Thành viên</Text>

          <View style={styles.headerRight}>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="people-outline" size={20} color="#1E2430" />
            </Pressable>

            <Pressable
              hitSlop={10}
              onPress={() => navigation.navigate("HanakaRatingInfo")}
            >
              <Text style={styles.headerLink}>Tự chấm trình</Text>
            </Pressable>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Họ tên, ID, SĐT..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
          </View>

          <Pressable style={styles.searchBtn} onPress={onSearch}>
            <Text style={styles.searchBtnText}>Tìm kiếm</Text>
          </Pressable>
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thành Viên</Text>
          <View style={styles.sectionRightCols}>
            <Ionicons name="people" size={18} color="#1E2430" />
            <Ionicons name="person" size={18} color="#1E2430" />
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.userId)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (!loading && canLoadMore) fetchMembers({ reset: false });
        }}
        ListFooterComponent={
          loading ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </View>
  );
}
