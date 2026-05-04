import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/colors";
import { deleteMe } from "../../services/userService";

function InfoRow({ icon, text, danger = false }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={18}
        color={danger ? "#DC2626" : COLORS.BLUE}
        style={styles.infoIcon}
      />
      <Text style={[styles.infoText, danger && styles.infoTextDanger]}>
        {text}
      </Text>
    </View>
  );
}

export default function DeleteAccountScreen({ navigation }) {
  const { session, booting, logout } = useAuth();
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const user = session?.user || null;
  const accessToken = session?.accessToken || null;

  const accountSummary = useMemo(() => {
    if (!user) return "";

    const email = user?.email ? `Email: ${user.email}` : null;
    const userId = user?.userId ? `User ID: ${user.userId}` : null;

    return [email, userId].filter(Boolean).join(" • ");
  }, [user]);

  const goHomeAfterDeletion = async () => {
    try {
      await logout();
    } finally {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: {
              index: 0,
              routes: [{ name: "Home" }],
            },
          },
        ],
      });
    }
  };

  const handleDeleteAccount = () => {
    if (!accessToken || submitting) return;

    Alert.alert(
      "Delete Account",
      "This action permanently deletes access to your account. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setSubmitting(true);

              const response = await deleteMe();

              Alert.alert(
                "Account Deleted",
                response?.message ||
                  "Your account has been permanently deleted.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      void goHomeAfterDeletion();
                    },
                  },
                ],
              );
            } catch (error) {
              const message =
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "Account deletion failed.";

              Alert.alert("Delete Account", String(message));
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  if (booting) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.centerText}>Loading account information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>

        <Text style={styles.headerTitle}>Delete Account</Text>

        <View style={styles.headerRight} />
      </View>

      {!accessToken ? (
        <View style={styles.centerState}>
          <Ionicons name="person-circle-outline" size={52} color={COLORS.BLUE} />
          <Text style={styles.centerTitle}>Sign in required</Text>
          <Text style={styles.centerText}>
            Please sign in before you delete an account.
          </Text>

          <Pressable
            style={[styles.primaryButton, styles.primaryButtonWide]}
            onPress={() =>
              navigation.navigate("AuthStack", {
                screen: "Login",
              })
            }
          >
            <Text style={styles.primaryButtonText}>Go to Login</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="trash-outline" size={28} color="#DC2626" />
            </View>

            <Text style={styles.heroTitle}>Delete your Hanaka Sport account</Text>

            <Text style={styles.heroText}>
              Use this screen to permanently delete your account directly inside
              the app.
            </Text>

            {accountSummary ? (
              <Text style={styles.accountSummary}>{accountSummary}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What will happen</Text>

            <InfoRow
              icon="close-circle-outline"
              text="You will immediately lose access to this account."
              danger
            />
            <InfoRow
              icon="shield-checkmark-outline"
              text="Profile data such as email, phone number, avatar, bio, and password will be deleted or anonymized."
            />
            <InfoRow
              icon="copy-outline"
              text="Tournament records or moderation records may be retained in anonymized form for operational and security purposes."
            />
            <InfoRow
              icon="log-out-outline"
              text="After deletion, the app will sign you out."
            />
          </View>

          <Pressable
            style={styles.acknowledgeRow}
            onPress={() => setAcknowledged((prev) => !prev)}
          >
            <Ionicons
              name={acknowledged ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={acknowledged ? "#16A34A" : "#94A3B8"}
            />
            <Text style={styles.acknowledgeText}>
              I understand that account deletion is permanent.
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              styles.deleteButton,
              (!acknowledged || submitting) && styles.disabledButton,
            ]}
            onPress={handleDeleteAccount}
            disabled={!acknowledged || submitting}
          >
            <Text style={styles.primaryButtonText}>
              {submitting ? "Deleting Account..." : "Delete Account Permanently"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Account")}
          >
            <Text style={styles.secondaryButtonText}>Back to Account</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  headerRight: {
    width: 32,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  heroCard: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 18,
    padding: 18,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B5563",
  },
  accountSummary: {
    marginTop: 12,
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },
  infoTextDanger: {
    color: "#B91C1C",
  },
  acknowledgeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  acknowledgeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "600",
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 18,
  },
  primaryButtonWide: {
    marginTop: 20,
    minWidth: 180,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
  disabledButton: {
    opacity: 0.45,
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  centerState: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  centerText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },
});
