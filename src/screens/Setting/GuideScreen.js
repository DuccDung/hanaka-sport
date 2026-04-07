import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/colors";
import { styles } from "./guideStyles";
import { getGuideScreenLinks } from "../../services/publicLinkService";

export default function GuideScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [contactLinks, setContactLinks] = useState([]);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await getGuideScreenLinks();
      setContactLinks(data.contactLinks || []);
    } catch (error) {
      console.log("loadLinks error:", error);
      setContactLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const openLink = async (item) => {
    const url = item?.url || "";
    if (!url) return;

    if (item.isPhone || url.startsWith("tel:")) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
      return;
    }

    navigation.navigate("AppWebView", {
      title: item.title,
      url,
    });
  };

  const renderContactIcon = (item) => {
    switch (item.kind) {
      case "email":
        return <MaterialIcons name="email" size={22} color="#3559A8" />;

      case "zalo":
        return (
          <View style={styles.zaloCircle}>
            <Text style={styles.zaloText}>Zalo</Text>
          </View>
        );

      case "phone":
        return <Ionicons name="call-outline" size={22} color="#3559A8" />;

      case "website":
        return <Ionicons name="globe-outline" size={22} color="#3559A8" />;

      case "facebook":
        return (
          <FontAwesome name="facebook-official" size={22} color="#3559A8" />
        );

      case "youtube":
        return <FontAwesome name="youtube-play" size={22} color="#F44336" />;

      default:
        return <Ionicons name="link-outline" size={22} color="#3559A8" />;
    }
  };

  return (
    <SafeAreaView style={styles.guideSafe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

      <View style={styles.guideHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.guideBackBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#1E2430" />
        </Pressable>

        <Text style={styles.guideHeaderTitle}>
          Hướng dẫn sử dụng, giới thiệu APP
        </Text>
      </View>

      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.WHITE,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.guideScrollContent}
        >
          <Text style={styles.guideSectionTitle}>Thông tin Hanaka Sport</Text>

          <View style={styles.guideContactList}>
            {contactLinks.length > 0 ? (
              contactLinks.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.guideContactCard}
                  onPress={() => openLink(item)}
                >
                  <View style={styles.guideContactLeft}>
                    <View style={styles.guideContactIcon}>
                      {renderContactIcon(item)}
                    </View>
                    <Text style={styles.guideContactText}>{item.title}</Text>
                  </View>

                  <Entypo name="chevron-thin-right" size={18} color="#2C2C2C" />
                </Pressable>
              ))
            ) : (
              <View style={styles.guideEmptyWrap}>
                <Text style={styles.guideEmptyText}>
                  Chưa có dữ liệu liên hệ
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
