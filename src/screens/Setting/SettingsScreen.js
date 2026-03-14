import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/colors";
import { styles } from "./styles";

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [language, setLanguage] = useState("vi");

  const [showFullName, setShowFullName] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showBirthday, setShowBirthday] = useState(false);

  const [birthdayNotify, setBirthdayNotify] = useState(false);

  const appVersion = "1.8.7 (384)";

  return (
    <SafeAreaView style={styles.settingsSafe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

      {/* Header */}
      <View style={styles.settingsHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.settingsBackBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#1E2430" />
        </Pressable>

        <Text style={styles.settingsHeaderTitle}>Cài Đặt</Text>

        <View style={styles.settingsHeaderRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.settingsScrollContent}
      >
        {/* Ngôn ngữ */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Ngôn ngữ</Text>

          <View style={styles.languageRow}>
            <Pressable
              style={[
                styles.languageButton,
                language === "vi" && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage("vi")}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === "vi" && styles.languageButtonTextActive,
                ]}
              >
                Tiếng Việt
              </Text>
              <Text style={styles.flagText}>🇻🇳</Text>
            </Pressable>

            <Pressable
              style={[
                styles.languageButton,
                language === "en" && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage("en")}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === "en" && styles.languageButtonTextActive,
                ]}
              >
                Tiếng Anh
              </Text>
              <Text style={styles.flagText}>🇬🇧</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.settingsDivider} />

        {/* Quyền riêng tư */}
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

        {/* Thông tin ứng dụng */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Thông tin ứng dụng</Text>
          <Text style={styles.appVersionText}>Phiên bản: {appVersion}</Text>
        </View>

        <View style={styles.settingsDivider} />

        {/* Sự kiện */}
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
