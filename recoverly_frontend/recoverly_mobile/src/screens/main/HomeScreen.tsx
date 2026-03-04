// src/screens/HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type QuickActionKey = "meeting" | "sponsor" | "journal" | "sos";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  // Dummy data (replace with API data later)
  const userName = "Alex";
  const streakDays = 42;
  const moodLabel = "Good";
  const moodSub = "Avg. Mood this week";
  const hydrationPct = 85;
  const hydrationSub = "Hydration Goal";

  const goToCheckIn = () => navigation.navigate("CheckIn");
  const goToProfile = () => navigation.navigate("Profile");

  const onQuickAction = (key: QuickActionKey) => {
    // For now: route to placeholders. Change later.
    if (key === "sos") {
      // You can later open an emergency screen/modal
      return;
    }
    if (key === "journal") return goToCheckIn();
    if (key === "meeting") return navigation.navigate("Social");
    if (key === "sponsor") return navigation.navigate("Social");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={goToProfile} activeOpacity={0.8}>
              <View style={styles.avatarWrap}>
                {<Ionicons name="person" size={18} color="#1f2937" /> }
              </View>
            </TouchableOpacity>

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.smallMuted}>Good Morning</Text>
              <Text style={styles.h1}>Welcome back, {userName}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
            {<Ionicons name="notifications-outline" size={20} color="#111827" /> }
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>CURRENT STREAK</Text>

          <View style={styles.streakRow}>
            <Text style={styles.streakNumber}>{streakDays}</Text>
            <Text style={styles.streakDays}>Days</Text>

            <View style={styles.streakBadge}>
              {<Ionicons name="trending-up" size={14} color="#16a34a" /> }
              <Text style={styles.streakBadgeText}>+1 day since yesterday</Text>
            </View>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(100, (streakDays / 60) * 100)}%` },
                ]}
              />
            </View>

            <View style={styles.progressMetaRow}>
              <Text style={styles.progressMeta}>Milestone: 30 Days</Text>
              <Text style={styles.progressMeta}>Next: 60 Days</Text>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.card, styles.statCard]}>
            <View style={styles.statIconWrap}>
              {<Ionicons name="happy-outline" size={18} color="#2563eb" /> }
            </View>
            <Text style={styles.statValue}>{moodLabel}</Text>
            <Text style={styles.statSub}>{moodSub}</Text>
          </View>

          <View style={[styles.card, styles.statCard]}>
            <View style={styles.statIconWrap}>
              {<Ionicons name="water-outline" size={18} color="#7c3aed" /> }
            </View>
            <Text style={styles.statValue}>{hydrationPct}%</Text>
            <Text style={styles.statSub}>{hydrationSub}</Text>
          </View>
        </View>

        {/* Check-in card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How are you feeling?</Text>
          <Text style={styles.cardBody}>
            Log your mood and cravings to track your progress over time.
          </Text>

          <TouchableOpacity
            style={styles.checkinBtn}
            onPress={goToCheckIn}
            activeOpacity={0.85}
          >
            {<Ionicons name="checkbox-outline" size={18} color="#0f172a" /> }
            <Text style={styles.checkinBtnText}>Daily Check-in</Text>
          </TouchableOpacity>
        </View>

        {/* Inspiration card */}
        <View style={styles.inspirationWrap}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=70",
            }}
            style={styles.inspirationBg}
            imageStyle={styles.inspirationImg}
          >
            <View style={styles.inspirationTopRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>INSPIRATION</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8}>
                {<Ionicons name="share-social-outline" size={18} color="#fff" /> }
              </TouchableOpacity>
            </View>

            <Text style={styles.quote}>
              "Recovery is not a race.{"\n"}You don't have to do it fast,{"\n"}
              you just have to keep{"\n"}going."
            </Text>
            <Text style={styles.quoteBy}>— Daily Wisdom</Text>
          </ImageBackground>
        </View>

        {/* Quick Actions */}
        <Text style={styles.quickTitle}>Quick Actions</Text>

        <View style={styles.quickGrid}>
         <View style={styles.quickRow}>
           <QuickAction
            label="Find Meeting"
            icon={<MaterialCommunityIcons name="account-group-outline" size={18} color="#111827" />}
            onPress={() => onQuickAction("meeting")}
          /> 
           <QuickAction
            label="Contact Sponsor"
            icon={<Ionicons name="call-outline" size={18} color="#111827" />}
            onPress={() => onQuickAction("sponsor")}
          /> 
          </View>

          <View style={styles.quickRow}>
          <QuickAction
            label="Journal"
            icon={<Ionicons name="book-outline" size={18} color="#111827" />}
            onPress={() => onQuickAction("journal")}
          /> 
          <QuickAction
            label="Emergency Help"
            danger
            icon={<Ionicons name="alert-circle-outline" size={18} color="#fff" />}
            onPress={() => onQuickAction("sos")}
          /> 
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  label,
  icon,
  onPress,
  danger,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.quickItem, danger ? styles.quickItemDanger : null]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.quickIcon, danger ? styles.quickIconDanger : null]}>
        {icon}
      </View>
      <Text style={[styles.quickLabel, danger ? styles.quickLabelDanger : null]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6fbf7" },
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  avatarWrap: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d7f0da",
  },
  iconBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  smallMuted: { fontSize: 12, color: "#6b7280" },
  h1: { fontSize: 16, fontWeight: "700", color: "#111827", marginTop: 1 },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e6f0e8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 12,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: 0.6,
    marginBottom: 10,
    textAlign: "center",
  },

  streakRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  streakNumber: { fontSize: 44, fontWeight: "800", color: "#111827" },
  streakDays: { fontSize: 14, fontWeight: "700", color: "#16a34a", marginBottom: 8 },

  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#c7f2d6",
    marginBottom: 6,
  },
  streakBadgeText: { fontSize: 12, color: "#16a34a", fontWeight: "600" },

  progressWrap: { marginTop: 12 },
  progressBarBg: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#ecfdf3",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#c7f2d6",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#22c55e",
  },
  progressMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressMeta: { fontSize: 11, color: "#6b7280" },

  statsRow: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, alignItems: "flex-start" },
  statIconWrap: {
    height: 30,
    width: 30,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: { fontSize: 18, fontWeight: "800", color: "#111827" },
  statSub: { fontSize: 11, color: "#6b7280", marginTop: 4 },

  cardTitle: { fontSize: 14, fontWeight: "800", color: "#111827" },
  cardBody: { fontSize: 12, color: "#6b7280", marginTop: 6, lineHeight: 16 },

  checkinBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#cfe9c8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#b6ddb0",
  },
  checkinBtnText: { fontSize: 13, fontWeight: "800", color: "#0f172a" },

  inspirationWrap: { marginBottom: 14 },
  inspirationBg: { height: 170, borderRadius: 16, overflow: "hidden", padding: 14 },
  inspirationImg: { borderRadius: 16 },
  inspirationTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  pillText: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },

  quote: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 2,
  },
  quoteBy: { color: "rgba(255,255,255,0.9)", fontSize: 11, marginTop: 8, fontWeight: "600" },

  quickTitle: { fontSize: 13, fontWeight: "800", color: "#111827", marginBottom: 10 },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickRow: { flexDirection: "row", width: "100%", justifyContent: "space-between", gap: 12, marginBottom: 12 },
  quickItem: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e6f0e8",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickItemDanger: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  quickIcon: {
    height: 34,
    width: 34,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickIconDanger: { backgroundColor: "rgba(255,255,255,0.15)" },
  quickLabel: { fontSize: 12, fontWeight: "700", color: "#111827", textAlign: "center" },
  quickLabelDanger: { color: "#fff" },
});
