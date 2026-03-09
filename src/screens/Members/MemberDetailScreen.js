import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Pressable,
  Linking,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { getUserDetail } from "../../services/userService";

export default function MemberDetailScreen({ route, navigation }) {
  const { userId } = route.params;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserDetail(userId);
        setUser(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const callUser = () => {
    if (!user?.phone) return;
    Linking.openURL(`tel:${user.phone}`);
  };

  const smsUser = () => {
    if (!user?.phone) return;
    Linking.openURL(`sms:${user.phone}`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) return null;

  const hasAvatar = !!user.avatarUrl;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>

        <Text style={{ marginLeft: 10, fontWeight: "700", fontSize: 16 }}>
          Thông tin thành viên
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Avatar */}
        <View style={{ alignItems: "center" }}>
          {hasAvatar ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
              }}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={120}
              color={COLORS.BLUE}
            />
          )}

          <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 10 }}>
            {user.fullName}
          </Text>

          <Text
            style={{
              color: user.verified ? "#16A34A" : "#DC2626",
              marginTop: 4,
            }}
          >
            {user.verified ? "Đã xác thực" : "Chưa xác thực"}
          </Text>
        </View>

        {/* Rating */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
          }}
        >
          <Text>Single: {user.ratingSingle?.toFixed(2) ?? "0.00"}</Text>
          <Text>Double: {user.ratingDouble?.toFixed(2) ?? "0.00"}</Text>
        </View>

        {/* Info */}
        <View style={{ marginTop: 20 }}>
          <Text>Giới tính: {user.gender || "—"}</Text>
          <Text>Thành phố: {user.city || "—"}</Text>
          <Text>Email: {user.email || "—"}</Text>
          <Text>SĐT: {user.phone || "—"}</Text>
          <Text style={{ marginTop: 10 }}>Giới thiệu:</Text>
          <Text style={{ color: "#6B7280" }}>{user.bio || "—"}</Text>
        </View>

        {/* Buttons */}
        <View style={{ marginTop: 30 }}>
          <Pressable
            onPress={callUser}
            style={{
              backgroundColor: "#16A34A",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Gọi điện</Text>
          </Pressable>

          <Pressable
            onPress={smsUser}
            style={{
              backgroundColor: COLORS.BLUE,
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Nhắn tin</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
