import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { COMMUNITY_PRIVACY_URL } from "../../constants/communitySafety";
import { styles } from "./styles";

function NavRow({ label, icon, onPress }) {
  return (
    <Pressable style={styles.navRow} onPress={onPress}>
      <View style={styles.navRowLeft}>
        <Ionicons name={icon} size={18} color={COLORS.BLUE} />
        <Text style={styles.navRowLabel}>{label}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [showFullName, setShowFullName] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showBirthday, setShowBirthday] = useState(false);
  const [birthdayNotify, setBirthdayNotify] = useState(false);

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
          <Text style={styles.settingsSectionTitle}>Quyền riêng tư</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Hiển thị họ tên</Text>
            <Switch
              value={showFullName}
              onValueChange={setShowFullName}
              trackColor={{ false: "#D9D7E2", true: COLORS.PRIMARY }}
              thumbColor="#8B8698"
              ios_backgroundColor="#D9D7E2"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Hiển thị số điện thoại</Text>
            <Switch
              value={showPhone}
              onValueChange={setShowPhone}
              trackColor={{ false: "#D9D7E2", true: COLORS.PRIMARY }}
              thumbColor="#8B8698"
              ios_backgroundColor="#D9D7E2"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Hiển thị Email</Text>
            <Switch
              value={showEmail}
              onValueChange={setShowEmail}
              trackColor={{ false: "#D9D7E2", true: COLORS.PRIMARY }}
              thumbColor="#8B8698"
              ios_backgroundColor="#D9D7E2"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Hiển thị ngày sinh</Text>
            <Switch
              value={showBirthday}
              onValueChange={setShowBirthday}
              trackColor={{ false: "#D9D7E2", true: COLORS.PRIMARY }}
              thumbColor="#8B8698"
              ios_backgroundColor="#D9D7E2"
            />
          </View>
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

        <View style={styles.settingsDivider} />

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Sự kiện</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Báo cho bạn bè sinh nhật</Text>
            <Switch
              value={birthdayNotify}
              onValueChange={setBirthdayNotify}
              trackColor={{ false: "#D9D7E2", true: COLORS.PRIMARY }}
              thumbColor="#8B8698"
              ios_backgroundColor="#D9D7E2"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
