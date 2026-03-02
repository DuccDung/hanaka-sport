// src/screens/Tournament/TournamentStandingsGroupScreen.js
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
      </View>

      <FlatList
        contentContainerStyle={styles.listPad}
        data={group?.rows ?? []}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.groupCard, { marginBottom: 10 }]}>
            <Text style={styles.groupTitle}>{item.team}</Text>
            <Text style={{ fontSize: 13, color: "#1E2430" }}>
              Thắng: {item.win} • Điểm: {item.point} • HSố: {item.hso} • Hạng:{" "}
              {item.rank}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
