import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../auth/AuthContext";

export default function ProfileScreen() {
  const { logout } = useAuth();

  // Dummy data for now (replace later with API data)
  const name = "Alex Chen";
  const daysStrong = 124;
  const joinedText = "Part of Recoverly since Oct 2023";

  const [nudgesEnabled, setNudgesEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.title}>Profile</Text>

          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
            <Ionicons name="settings-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Avatar + Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color="#111827" />
            <View style={styles.statusDot}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
          </View>

          <Text style={styles.name}>{name}</Text>

          <Text style={styles.daysStrong}>
            <Text style={styles.daysStrongNum}>{daysStrong}</Text> Days Strong
          </Text>

          <Text style={styles.joined}>{joinedText}</Text>
        </View>

        {/* Goals Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Your Journey Goals</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.link}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalRow}>
            <View style={styles.goalLeft}>
              <View style={styles.goalIcon}>
                <Ionicons name="leaf-outline" size={16} color="#16a34a" />
              </View>
              <View>
                <Text style={styles.goalTitle}>Daily Mindfulness</Text>
                <Text style={styles.goalSub}>15 mins of guided calm</Text>

                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: "55%" }]} />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.smallBtn} activeOpacity={0.85}>
              <Text style={styles.smallBtnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy & Safety */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy & Safety</Text>

          <View style={styles.privacyRow}>
            <View style={styles.privacyIcon}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#16a34a" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyTitle}>Continuous Care Analysis</Text>
              <Text style={styles.privacyBody}>
                Recoverly looks for patterns in your tone to offer supportive nudges when you might
                need them most.
              </Text>

              <View style={styles.encryptPill}>
                <Ionicons name="lock-closed" size={14} color="#16a34a" />
                <Text style={styles.encryptText}>
                  {" "}
                  End-to-end encrypted. No humans read your chats.
                </Text>
              </View>

              <TouchableOpacity style={styles.howBtn} activeOpacity={0.85}>
                <Text style={styles.howBtnText}>How it works</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Support Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Support Preferences</Text>

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={18} color="#111827" />
              <Text style={styles.rowText}>Supportive Nudges</Text>
            </View>

            <Switch
              value={nudgesEnabled}
              onValueChange={setNudgesEnabled}
              trackColor={{ false: "#e5e7eb", true: "#86efac" }}
              thumbColor={nudgesEnabled ? "#22c55e" : "#9ca3af"}
            />
          </View>

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.85}>
            <View style={styles.rowLeft}>
              <Ionicons name="people-outline" size={18} color="#111827" />
              <Text style={styles.rowText}>Emergency Contacts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.85}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={18} color="#111827" />
              <Text style={styles.rowText}>Quiet Hours</Text>
            </View>
            <Text style={styles.rowRightText}>10 PM - 7 AM</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#111827" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Recoverly Version 2.4.0 (Build 892)</Text>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6fbf7" },
  container: { paddingHorizontal: 16, paddingTop: 10 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 16, fontWeight: "800", color: "#111827" },

  profileHeader: { alignItems: "center", paddingVertical: 10, marginBottom: 10 },
  avatar: {
    height: 84,
    width: 84,
    borderRadius: 42,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#c7f2d6",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  statusDot: {
    position: "absolute",
    right: 6,
    bottom: 6,
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { fontSize: 18, fontWeight: "900", color: "#111827", marginTop: 10 },
  daysStrong: { marginTop: 4, fontSize: 12, color: "#16a34a", fontWeight: "800" },
  daysStrongNum: { fontWeight: "900" },
  joined: { marginTop: 4, fontSize: 11, color: "#6b7280" },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e6f0e8",
    marginBottom: 12,
  },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 13, fontWeight: "900", color: "#111827" },
  link: { fontSize: 12, fontWeight: "800", color: "#16a34a" },

  goalRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  goalLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  goalIcon: {
    height: 34,
    width: 34,
    borderRadius: 12,
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#c7f2d6",
    alignItems: "center",
    justifyContent: "center",
  },
  goalTitle: { fontSize: 12, fontWeight: "900", color: "#111827" },
  goalSub: { fontSize: 11, color: "#6b7280", marginTop: 2 },

  progressBg: {
    marginTop: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#c7f2d6",
    overflow: "hidden",
    width: 170,
  },
  progressFill: { height: "100%", backgroundColor: "#22c55e" },

  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#c7f2d6",
  },
  smallBtnText: { fontSize: 11, fontWeight: "900", color: "#16a34a" },

  privacyRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  privacyIcon: {
    height: 34,
    width: 34,
    borderRadius: 12,
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#c7f2d6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  privacyTitle: { fontSize: 12, fontWeight: "900", color: "#111827" },
  privacyBody: { fontSize: 11, color: "#6b7280", marginTop: 6, lineHeight: 15 },

  encryptPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#c7f2d6",
    marginTop: 10,
  },
  encryptText: { fontSize: 10, fontWeight: "700", color: "#16a34a" },

  howBtn: {
    marginTop: 10,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  howBtnText: { fontSize: 12, fontWeight: "800", color: "#111827" },

  rowItem: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    backgroundColor: "#fff",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowText: { fontSize: 12, fontWeight: "800", color: "#111827" },
  rowRightText: { fontSize: 11, color: "#6b7280", fontWeight: "700" },

  logoutBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  logoutText: { fontSize: 13, fontWeight: "900", color: "#111827" },
  versionText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "700",
  },
});
