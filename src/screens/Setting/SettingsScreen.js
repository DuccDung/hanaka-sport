import React from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { COMMUNITY_PRIVACY_URL } from "../../constants/communitySafety";
import { styles } from "./styles";

function NavRow({ label, icon, onPress, danger = false }) {
  return (
    <Pressable style={styles.navRow} onPress={onPress}>
      <View style={styles.navRowLeft}>
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#DC2626" : COLORS.BLUE}
        />
        <Text
          style={[styles.navRowLabel, danger ? styles.navRowLabelDanger : null]}
        >
          {label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation();

  const appVersion = "1.0.0";

  return (
    <SafeAreaView style={styles.settingsSafe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

      <View style={styles.settingsHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.settingsBackBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#1E2430" />
        </Pressable>

        <Text style={styles.settingsHeaderTitle}>Cài đặt</Text>

        <View style={styles.settingsHeaderRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.settingsScrollContent}
      >
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Account</Text>

          <NavRow
            label="Manage Profile"
            icon="person-circle-outline"
            onPress={() => navigation.navigate("Account")}
          />

          <NavRow
            label="Delete Account"
            icon="trash-outline"
            danger
            onPress={() => navigation.navigate("DeleteAccount")}
          />

          <Text style={styles.sectionNote}>
            Delete Account opens the permanent account deletion flow directly in
            the app.
          </Text>
        </View>

        <View style={styles.settingsDivider} />

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>An toàn cộng đồng</Text>

          <NavRow
            label="Điều khoản, moderation và block list"
            icon="shield-checkmark-outline"
            onPress={() => navigation.navigate("CommunitySafety")}
          />

          <NavRow
            label="Chính sách quyền riêng tư"
            icon="document-text-outline"
            onPress={() =>
              navigation.navigate("PolicyWebView", {
                title: "Chính sách quyền riêng tư",
                url: COMMUNITY_PRIVACY_URL,
              })
            }
          />

          <Text style={styles.sectionNote}>
            Chat CLB đã bật bộ lọc nội dung, cơ chế báo cáo vi phạm, chặn người
            dùng và cam kết xử lý moderation trong vòng 24 giờ.
          </Text>
        </View>

        <View style={styles.settingsDivider} />

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Thông tin ứng dụng</Text>
          <Text style={styles.appVersionText}>Phiên bản: {appVersion}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
