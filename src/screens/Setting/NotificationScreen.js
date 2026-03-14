import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/colors";
import { styles } from "./notificationStyles";

export default function NotificationScreen() {
  const navigation = useNavigation();

  const [notifications] = useState([
    {
      id: "1",
      title: "Sport Connect - Thông báo",
      message: "Bạn chuẩn bị thi đấu tại sân D lúc 13h",
      time: "27/11/2025 08:50",
    },
    {
      id: "2",
      title: "Sport Connect - Thông báo",
      message: "Bạn chuẩn bị thi đấu tại sân D lúc 13h",
      time: "27/11/2025 08:50",
    },
    {
      id: "3",
      title: "Sport Connect - Thông báo",
      message: "Bạn chuẩn bị thi đấu tại sân D lúc 13h",
      time: "27/11/2025 08:49",
    },
    {
      id: "4",
      title: "Sport Connect - Thông báo",
      message: "Cảm ơn các bạn đã quan tâm, ủng hộ SPORT CONNECT",
      time: "26/11/2025 14:04",
    },
    {
      id: "5",
      title: "Sport Connect - Thông báo",
      message: "Bạn chuẩn bị thi đấu tại sân D lúc 13h",
      time: "26/11/2025 14:03",
    },
    {
      id: "6",
      title: "Sport Connect - Thông báo",
      message: "Bạn chuẩn bị thi đấu tại sân D lúc 13h",
      time: "26/11/2025 14:03",
    },
    {
      id: "7",
      title: "Sport Connect - Thông báo",
      message: "Bạn chuẩn bị thi đấu tại sân D lúc 13h",
      time: "26/11/2025 13:54",
    },
    {
      id: "8",
      title: "Sport Connect - Thông báo",
      message: "Thông báo từ hệ thống SportConnect",
      time: "25/11/2025 10:20",
    },
  ]);

  const renderItem = ({ item }) => {
    return (
      <Pressable style={styles.notificationCard}>
        <Text style={styles.notificationTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>

        <Text style={styles.notificationTime}>{item.time}</Text>
      </Pressable>
    );
  };

  const keyExtractor = useMemo(() => (item) => item.id, []);

  return (
    <SafeAreaView style={styles.notificationSafe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

      <View style={styles.notificationHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.notificationBackBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#1E2430" />
        </Pressable>

        <Text style={styles.notificationHeaderTitle}>Thông Báo</Text>

        <View style={styles.notificationHeaderRight} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.notificationListContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
