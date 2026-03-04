import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../auth/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const onLogin = () => {
    // Later: call backend API, then store real token.
    // For now: demo login to enter tabs
    login("demo-token");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={22} color="#16a34a" />
            </View>

            <Text style={styles.brand}>Recoverly</Text>
            <Text style={styles.subtitle}>
              Secure access to your daily support{"\n"}system.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email or phone"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={{ height: 14 }} />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { paddingRight: 44 }]}
                placeholder="Enter password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPw((v) => !v)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={showPw ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={onLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.loginBtnText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={styles.signupMuted}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.8}
              >
                <Text style={styles.signupLink}>Sign up for Recoverly</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                <Text style={styles.socialText}>G  Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                <Text style={styles.socialText}>  Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerInfo}>
              <View style={styles.encryptPill}>
                <Ionicons name="lock-closed" size={14} color="#16a34a" />
                <Text style={styles.encryptText}> END-TO-END ENCRYPTED</Text>
              </View>

              <Text style={styles.helpText}>
                Need help? <Text style={styles.helpLink}>Contact Support</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6fbf7" },
  container: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 28 },

  logoWrap: { alignItems: "center", marginBottom: 18 },
  logoCircle: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cfe9c8",
  },
  brand: { fontSize: 22, fontWeight: "800", color: "#111827", marginTop: 10 },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: "#6b7280",
    lineHeight: 16,
  },

  form: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e6f0e8",
  },

  label: { fontSize: 12, fontWeight: "700", color: "#111827", marginBottom: 8 },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    color: "#111827",
  },

  passwordRow: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 0,
    height: 46,
    justifyContent: "center",
  },

  forgotBtn: { alignSelf: "flex-end", marginTop: 10, marginBottom: 14 },
  forgotText: { color: "#16a34a", fontSize: 12, fontWeight: "700" },

  loginBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  loginBtnText: { color: "#052e16", fontSize: 14, fontWeight: "900" },

  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  signupMuted: { fontSize: 12, color: "#6b7280" },
  signupLink: { fontSize: 12, color: "#16a34a", fontWeight: "800" },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { fontSize: 11, color: "#6b7280" },

  socialRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  socialBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  socialText: { fontSize: 12, fontWeight: "800", color: "#111827" },

  footerInfo: { alignItems: "center", marginTop: 16, gap: 10 },
  encryptPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#c7f2d6",
  },
  encryptText: { fontSize: 10, fontWeight: "900", color: "#16a34a" },
  helpText: { fontSize: 11, color: "#6b7280" },
  helpLink: { color: "#16a34a", fontWeight: "800" },
});
