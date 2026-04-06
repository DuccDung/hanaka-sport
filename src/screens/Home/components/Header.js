import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AppStatusBar from "../../../components/AppStatusBar";
import { COLORS } from "../../../constants/colors";
import { styles } from "../styles";
import { useAuth } from "../../../context/AuthContext";

function normalizeAvatarUrl(value) {
  if (!value) return null;

  const s = String(value).trim();

  if (!s) return null;
  if (s === "null" || s === "undefined") return null;

  return s;
}

export default function Header({ sport, onToggleSport, onPressAvatar }) {
  const { session } = useAuth();
  const user = session?.user || null;

  const navigation = useNavigation();
  const avatarUrl = normalizeAvatarUrl(user?.avatarUrl);

  return (
    <>
      <AppStatusBar backgroundColor={COLORS.BLUE} />

      <View style={styles.header}>
        <Pressable style={styles.sportPicker} onPress={onToggleSport}>
          <Ionicons name="tennisball-outline" size={18} color="#fff" />
          <Text style={styles.sportText}>{sport}</Text>
          <Ionicons name="chevron-down" size={18} color="#fff" />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable
            style={styles.headerIcon}
            onPress={() => navigation.navigate("Notification")}
          >
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </Pressable>

          <Pressable
            style={styles.headerIcon}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </Pressable>

          {user ? (
            <Pressable
              onPress={() => navigation.navigate("Account")}
              hitSlop={10}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 36, height: 36 }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person-circle-outline" size={30} color="#fff" />
              )}
            </Pressable>
          ) : (
            <Pressable onPress={onPressAvatar} hitSlop={10}>
              <Ionicons name="person-circle-outline" size={30} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
}
