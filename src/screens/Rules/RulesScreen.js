import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
export default function RulesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* ===== THUẬT NGỮ (như ảnh 3) ===== */}
        <Text style={styles.blueTitle}>Thuật ngữ</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Ace:</Text> Một cú giao bóng mà đối thủ
          không chạm được và điểm được ghi.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Baseline:</Text> Đường giới hạn cuối cùng
          của sân, nơi người chơi thường đứng khi đánh từ nền.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Dink:</Text> Một cú đánh nhẹ nhàng đưa bóng
          qua lưới với mục đích làm khó đối thủ.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Drop Shot:</Text> Một cú đánh nhẹ nhàng nhằm
          đặt bóng ngay gần lưới.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Fault:</Text> Lỗi khi giao bóng hoặc khi
          đánh bóng ra ngoài biên.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Kitchen:</Text> Vùng cấm trước lưới, nơi
          người chơi không được đánh bóng khi đang đứng trong vùng này, trừ khi
          bóng đã chạm đất.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Let:</Text> Khi bóng chạm vào lưới trong lúc
          giao bóng nhưng vẫn đặt chính xác vào mục tiêu.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Rally:</Text> Chuỗi liên tiếp các cú đánh mà
          không có lỗi.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Serve:</Text> Cú giao bóng để bắt đầu mỗi
          game.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Smash:</Text> Cú đánh mạnh từ trên cao xuống
          với lực mạnh.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Volley:</Text> Cú đánh mà bóng được đánh
          trước khi nó chạm đất.
        </Text>

        {/* ===== LUẬT CHƠI (như ảnh 2) ===== */}
        <View style={{ height: 14 }} />
        <Text style={styles.blueTitle}>Luật chơi</Text>

        <Text style={styles.linkTitle}>Trước Trận Đấu:</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Sân thi đấu:</Text> Sân pickleball dài 44
          feet (13.41m) và rộng 20 feet (6.1m), với một vùng cấm gọi là
          "kitchen" dài 7 feet (2.1m) tính từ lưới vào trong sân.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Bảng điểm:</Text> Trận đấu được chơi đến 11,
          15 hoặc 21 điểm và đội hoặc người chơi phải thắng cách biệt ít nhất 2
          điểm.
        </Text>

        {/* ===== TRONG TRẬN ĐẤU (như ảnh 1) ===== */}
        <Text style={styles.linkTitle}>Trong Trận Đấu:</Text>

        <Text style={styles.h2}>Giao bóng:</Text>
        <Text style={styles.bullet}>
          • Người giao bóng phải đứng sau baseline và phải giao bóng theo kiểu
          underhand, tức là vợt phải tiếp xúc với bóng dưới thắt lưng.
        </Text>
        <Text style={styles.bullet}>
          • Bóng phải bay chéo sang ô nhận bóng của đối thủ và vượt qua lưới mà
          không chạm vào vùng cấm "kitchen".
        </Text>
        <Text style={styles.bullet}>
          • Người giao bóng có hai lần giao bóng, nếu cả hai lần đều lỗi thì đối
          phương sẽ được điểm.
        </Text>

        <Text style={styles.h2}>Cách đánh:</Text>
        <Text style={styles.bullet}>
          • Bóng phải chạm đất một lần ở bên phần sân của đối phương trước khi
          đánh tiếp.
        </Text>
        <Text style={styles.bullet}>
          • Bóng không được rơi vào vùng cấm “kitchen” trừ khi đã chạm đất ở
          ngoài vùng cấm trước đó.
        </Text>

        <Text style={styles.h2}>Quy tắc điểm:</Text>
        <Text style={styles.bullet}>
          • Điểm chỉ được ghi bởi đội đang giao bóng.
        </Text>
        <Text style={styles.bullet}>
          • Trận đấu kết thúc khi một đội đạt đủ số điểm quy định và cách biệt
          ít nhất 2 điểm.
        </Text>

        <Text style={styles.h2}>Rally và Faults:</Text>
        <Text style={styles.bullet}>
          • Rally tiếp tục cho đến khi một trong hai đội phạm lỗi.
        </Text>
        <Text style={styles.bullet}>
          • Các lỗi bao gồm: giao bóng sai, bóng chạm vào net và không vượt qua,
          bóng rơi vào vùng cấm "kitchen" không đúng luật, và bóng ra ngoài
          biên.
        </Text>

        <Text style={styles.linkTitle}>Chi Tiết Thêm:</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Nghỉ giữa trận:</Text> Có thời gian nghỉ
          ngắn giữa các set và nghỉ dài hơn giữa các trận đấu.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Mất trận đấu:</Text> Người chơi hoặc đội mất
          trận đấu khi đối thủ giành chiến thắng với số set nhiều hơn.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28, backgroundColor: "#EEF2F8" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E6EF",
    padding: 16,
  },

  blueTitle: {
    color: COLORS.BLUE,
    fontWeight: "900",
    fontSize: 20,
    marginBottom: 10,
  },

  linkTitle: {
    color: COLORS.BLUE,
    fontWeight: "800",
    fontSize: 18,
    textDecorationLine: "none",
    marginTop: 10,
    marginBottom: 5,
  },

  h2: { fontSize: 18, fontWeight: "800", marginTop: 12, marginBottom: 6 },

  bullet: { fontSize: 16, lineHeight: 24, marginLeft: 10, marginBottom: 8 },
  paragraph: { fontSize: 16, lineHeight: 24, marginBottom: 10 },
  bold: { fontWeight: "800" },
});
