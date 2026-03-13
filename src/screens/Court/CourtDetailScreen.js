import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPublicCourtDetail } from "../../services/courtService";
import { styles } from "./detailStyles";

export default function CourtDetailScreen({ navigation, route }) {
  const courtId = route?.params?.courtId;

  const [loading, setLoading] = useState(true);
  const [court, setCourt] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const res = await getPublicCourtDetail(courtId);
        setCourt(res);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Không tải được thông tin sân.";
        Alert.alert("Lỗi", String(msg), [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (courtId) {
      fetchDetail();
    } else {
      setLoading(false);
      Alert.alert("Lỗi", "Không tìm thấy mã sân.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, [courtId, navigation]);

  const images = useMemo(() => court?.images || [], [court]);

  const onCall = async () => {
    const phone = court?.phone;
    if (!phone) {
      Alert.alert("Thông báo", "Sân chưa có số điện thoại.");
      return;
    }

    const url = `tel:${phone}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("Thông báo", "Thiết bị không hỗ trợ gọi điện.");
      return;
    }

    await Linking.openURL(url);
  };

  const onSms = async () => {
    const phone = court?.phone;
    if (!phone) {
      Alert.alert("Thông báo", "Sân chưa có số điện thoại.");
      return;
    }

    const url = `sms:${phone}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("Thông báo", "Thiết bị không hỗ trợ nhắn tin.");
      return;
    }

    await Linking.openURL(url);
  };

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

          <Text style={styles.headerTitle}>Chi tiết sân</Text>

          <View style={{ width: 32 }} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.heroList}
              style={styles.heroWrap}
            >
              {images.map((img, idx) => (
                <Image
                  key={`${img}-${idx}`}
                  source={{ uri: img }}
                  style={styles.heroImage}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.heroImage, styles.heroFallback]}>
              <Ionicons name="image-outline" size={40} color="#9CA3AF" />
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.name}>
              {court?.courtName || "Chưa có tên sân"}
            </Text>

            <Text style={styles.line}>
              Khu vực:{" "}
              <Text style={styles.strong}>
                {court?.areaText || "Chưa cập nhật"}
              </Text>
            </Text>

            <Text style={styles.line}>
              Quản lý:{" "}
              <Text style={styles.strong}>
                {court?.managerName || "Chưa cập nhật"}
              </Text>
            </Text>

            <Text style={styles.line}>
              Điện thoại:{" "}
              <Text style={styles.strong}>
                {court?.phone || "Chưa cập nhật"}
              </Text>
            </Text>

            <View style={styles.actionsRow}>
              <Pressable style={styles.primaryBtn} onPress={onCall}>
                <Ionicons name="call" size={16} color="#fff" />
                <Text style={styles.primaryBtnText}>Gọi điện</Text>
              </Pressable>

              <Pressable style={styles.secondaryBtn} onPress={onSms}>
                <Ionicons name="chatbubble" size={16} color="#2563EB" />
                <Text style={styles.secondaryBtnText}>Nhắn tin</Text>
              </Pressable>
            </View>
          </View>

          {images.length > 0 ? (
            <View style={styles.galleryBlock}>
              <Text style={styles.galleryTitle}>Hình ảnh sân</Text>

              <View style={styles.galleryList}>
                {images.map((img, idx) => (
                  <Image
                    key={`thumb-${img}-${idx}`}
                    source={{ uri: img }}
                    style={styles.galleryImage}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
