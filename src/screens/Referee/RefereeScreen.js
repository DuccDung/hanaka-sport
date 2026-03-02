import React, { useMemo, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { refereeSeed } from "./data/Referee";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function RefereeScreen({ navigation }) {
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return refereeSeed;
    return refereeSeed.filter((m) => {
      const hay = normalize(`${m.name} ${m.city}`);
      return hay.includes(q);
    });
  }, [query]);

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.colStt}>
        <Text style={styles.thText}>STT</Text>
      </View>

      <View style={styles.colMember}>
        <Text style={styles.thText}>Thành Viên</Text>
      </View>

      <View style={styles.colScoreWrap}>
        <View style={styles.colScore}>
          <Text style={styles.thText}>Điểm đơn</Text>
        </View>
        <View style={styles.colScore}>
          <Text style={styles.thText}>Điểm đôi</Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const stt = index + 1;

    return (
      <View style={styles.item}>
        <View style={styles.colStt}>
          <Text style={styles.sttText}>{stt}</Text>
        </View>

        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        <View style={styles.mid}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.city}>{item.city}</Text>

          <Text style={item.verified ? styles.statusGood : styles.statusBad}>
            {item.verified ? "Đã xác thực" : "Chưa xác thực"}
          </Text>
        </View>

        <View style={styles.right}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{item.single}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{item.double}</Text>
          </View>
        </View>
      </View>
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

          <Text style={styles.headerTitle}>Trọng Tài</Text>

          <View style={styles.headerRight}>
            <Pressable
              style={styles.addBtn}
              hitSlop={10}
              onPress={() => navigation.navigate("RefereeEdit")}
            >
              <Ionicons name="add" size={26} color="#1E2430" />
            </Pressable>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <Ionicons name="search" size={18} color="#9CA3AF" />
          </View>
        </View>

        {renderHeader()}
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
