import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./standingsStyles";

export default function TournamentStandingsGroupScreen({ navigation, route }) {
  const group = route?.params?.group;
  const round = route?.params?.round;

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>

          <Text style={styles.headerTitle}>
            {group?.groupName ?? "Chi tiết bảng"}
          </Text>
        </View>

        {round?.label ? (
          <Text
            style={{
              paddingHorizontal: 16,
              paddingBottom: 8,
              color: "#6B7280",
              fontSize: 13,
            }}
          >
            {round.label}
          </Text>
        ) : null}
      </View>

      <FlatList
        contentContainerStyle={styles.listPad}
        data={group?.rows ?? []}
        keyExtractor={(item) => String(item.id || item.registrationId)}
        renderItem={({ item }) => (
          <View style={[styles.groupCard, { marginBottom: 10 }]}>
            <Text style={styles.groupTitle}>{item.team}</Text>

            <Text style={{ fontSize: 13, color: "#1E2430", marginTop: 4 }}>
              Đã đấu: {item.played}
            </Text>

            <Text style={{ fontSize: 13, color: "#1E2430", marginTop: 4 }}>
              Thắng: {item.win} • Điểm: {item.point} • HSố: {item.hso} • Hạng:{" "}
              {item.rank}
            </Text>

            <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
              Ghi được: {item.scoreFor} • Bị ghi: {item.scoreAgainst}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#6B7280" }}>
              Không có dữ liệu chi tiết bảng.
            </Text>
          </View>
        }
      />
    </View>
  );
}
