import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../../constants/colors";
import { styles } from "../styles";
import { useAuth } from "../../../context/AuthContext";

export default function Header({ sport, onToggleSport, onPressAvatar }) {
  const { session } = useAuth();
  const user = session?.user;

  const navigation = useNavigation();

  const avatarUrl = user?.avatarUrl;

  return (
    <>
      <SafeAreaView style={{ backgroundColor: COLORS.BLUE }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BLUE} />

      <View style={styles.header}>
        <Pressable style={styles.sportPicker} onPress={onToggleSport}>
          <Ionicons name="tennisball-outline" size={18} color="#fff" />
          <Text style={styles.sportText}>{sport}</Text>
          <Ionicons name="chevron-down" size={18} color="#fff" />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </Pressable>

          {/* Nếu có user -> hiện avatar + vào Account, nếu không -> hiện nút login (onPressAvatar) */}
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
