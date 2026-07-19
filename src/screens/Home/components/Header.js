import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AppStatusBar from "../../../components/AppStatusBar";
import NotificationBellButton from "../../../components/NotificationBellButton";
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

export default function Header({ onPressAvatar }) {
  const { width } = useWindowDimensions();
  const { session } = useAuth();
  const user = session?.user || null;
  const navigation = useNavigation();
  const avatarUrl = normalizeAvatarUrl(user?.avatarUrl);
  const isWide = width >= 600;
  const compact = width < 380;
  const markSize = isWide ? 54 : compact ? 42 : 46;
  const actionSize = isWide ? 40 : compact ? 32 : 36;
  const iconSize = isWide ? 20 : 18;
  const avatarIconSize = isWide ? 30 : compact ? 24 : 28;

  return (
    <>
      <AppStatusBar backgroundColor={COLORS.BLUE} />

      <View
        style={[
          styles.header,
          {
            paddingHorizontal: isWide ? 32 : 16,
          },
        ]}
      >
        <View style={styles.brandWrap}>
          <View
            style={[
              styles.brandMark,
              {
                width: markSize,
                height: markSize,
                borderRadius: isWide ? 18 : 15,
              },
            ]}
          >
            <Ionicons
              name="tennisball-outline"
              size={isWide ? 31 : 25}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={[
              styles.brandTitle,
              { fontSize: isWide ? 22 : compact ? 17 : 19 },
            ]}
            numberOfLines={1}
          >
            Hanaka Sport
          </Text>
        </View>

        <View style={styles.headerRight}>
          <NotificationBellButton
            style={[
              styles.headerActionButton,
              {
                width: actionSize,
                height: actionSize,
                borderRadius: isWide ? 16 : 13,
              },
            ]}
            size={iconSize}
            color="#FFFFFF"
            onPress={() => navigation.navigate("Notification")}
          />

          <Pressable
            style={[
              styles.headerActionButton,
              {
                width: actionSize,
                height: actionSize,
                borderRadius: isWide ? 16 : 13,
              },
            ]}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={iconSize} color="#FFFFFF" />
          </Pressable>

          {user ? (
            <Pressable
              onPress={() => navigation.navigate("Account")}
              hitSlop={10}
              style={[
                styles.headerAvatarButton,
                {
                  width: actionSize,
                  height: actionSize,
                  borderRadius: actionSize / 2,
                },
              ]}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{
                    width: actionSize,
                    height: actionSize,
                    borderRadius: actionSize / 2,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={avatarIconSize}
                  color="#FFFFFF"
                />
              )}
            </Pressable>
          ) : (
            <Pressable
              onPress={onPressAvatar}
              hitSlop={10}
              style={[
                styles.headerAvatarButton,
                {
                  width: actionSize,
                  height: actionSize,
                  borderRadius: actionSize / 2,
                },
              ]}
            >
              <Ionicons
                name="person-circle-outline"
                size={avatarIconSize}
                color="#FFFFFF"
              />
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
}
