import React from "react";
import { View, Text, SafeAreaView, Pressable, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { styles } from "../styles";

export default function Header({ sport, onToggleSport }) {
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

          <View style={styles.avatar}>
            <Ionicons name="person" size={18} color={COLORS.BLUE} />
          </View>
        </View>
      </View>
    </>
  );
}
