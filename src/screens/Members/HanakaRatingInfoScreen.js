import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./hanakaRatingInfoStyles";

export default function HanakaRatingInfoScreen({ navigation }) {
  const handleGoTournament = () => {
    navigation.navigate("Tournament");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#1E2430" />
        </Pressable>

        <Text style={styles.headerTitle}>Cách chấm trình</Text>

        <View style={styles.rightSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="trophy-outline" size={28} color="#2563EB" />
          </View>

          <Text style={styles.heroTitle}>Quy định chấm trình Hanaka Sport</Text>

          <Text style={styles.heroDesc}>
            Hanaka Sport áp dụng điểm trình mặc định khi người chơi mới tạo tài
            khoản, đồng thời cộng thêm điểm kinh nghiệm dựa trên thành tích thi
            đấu thực tế để làm cơ sở điều chỉnh mức trình trong hệ thống.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Điểm trình mặc định</Text>

          <View style={styles.infoRow}>
            <View style={styles.badgePink}>
              <Text style={styles.badgeText}>Nữ</Text>
            </View>
            <Text style={styles.infoText}>
              Người chơi nữ khi mới tạo tài khoản sẽ có mức điểm trình mặc định
              là <Text style={styles.bold}>1.8</Text>.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.badgeBlue}>
              <Text style={styles.badgeText}>Nam</Text>
            </View>
            <Text style={styles.infoText}>
              Người chơi nam khi mới tạo tài khoản sẽ có mức điểm trình mặc định
              là <Text style={styles.bold}>2.3</Text>.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Cộng điểm kinh nghiệm thi đấu</Text>

          <Text style={styles.paragraph}>
            Trong quá trình tham gia các giải đấu, người chơi sẽ được cộng thêm
            điểm kinh nghiệm dựa trên thành tích thực tế:
          </Text>

          <View style={styles.expItem}>
            <View style={styles.expLeft}>
              <Ionicons name="medal-outline" size={20} color="#F59E0B" />
              <Text style={styles.expLabel}>Vô địch</Text>
            </View>
            <Text style={styles.expValue}>+0.15 exp</Text>
          </View>

          <View style={styles.expItem}>
            <View style={styles.expLeft}>
              <Ionicons name="ribbon-outline" size={20} color="#6B7280" />
              <Text style={styles.expLabel}>Á quân</Text>
            </View>
            <Text style={styles.expValue}>+0.10 exp</Text>
          </View>

          <View style={styles.expItem}>
            <View style={styles.expLeft}>
              <Ionicons name="star-outline" size={20} color="#10B981" />
              <Text style={styles.expLabel}>Hạng ba</Text>
            </View>
            <Text style={styles.expValue}>+0.05 exp</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            3. Cách hệ thống sử dụng điểm exp
          </Text>

          <Text style={styles.paragraph}>
            Điểm kinh nghiệm tích lũy từ các giải đấu sẽ là cơ sở để hệ thống
            điều chỉnh mức trình của người chơi theo quá trình thi đấu thực tế.
          </Text>

          <View style={styles.noteBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#2563EB"
            />
            <Text style={styles.noteText}>
              Thành tích thi đấu càng tốt, điểm kinh nghiệm càng tăng, từ đó mức
              trình sẽ được cập nhật phù hợp hơn với năng lực thực tế của người
              chơi.
            </Text>
          </View>
        </View>

        <Pressable style={styles.primaryBtn} onPress={handleGoTournament}>
          <Ionicons name="search-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Tìm giải đấu ngay</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
