import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import axios from "axios";

// IMPORTANT: change to your laptop IP (not 127.0.0.1)
const STT_URL = "http://192.168.10.239:8003/api/stt/transcribe";

export default function CheckInScreen() {
  const [story, setStory] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Microphone permission required");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
    } catch (e: any) {
      Alert.alert("Recording failed", String(e?.message || e));
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) throw new Error("No recording URI");

      const form = new FormData();
      form.append("file", {
        uri,
        name: "dictation.m4a",
        type: "audio/m4a",
      } as any);

      const res = await axios.post(STT_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10 * 60 * 1000,
      });

      const transcript = (res.data?.text || "").trim();
      if (!transcript) {
        Alert.alert("No speech detected", "Try again closer to the mic.");
        return;
      }

      // Auto-fill into textarea (append)
      setStory((prev) => (prev ? prev + "\n" : "") + transcript);
    } catch (e: any) {
      Alert.alert("Transcription failed", String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  const onMicPress = () => {
    if (loading) return;
    if (recording) stopRecording();
    else startRecording();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>
        Type/paste your story, or tap mic → play audio near phone → tap stop.
      </Text>

      <View style={styles.boxWrap}>
        <TextInput
          style={styles.textArea}
          multiline
          value={story}
          onChangeText={setStory}
          placeholder="Write your story here…"
          textAlignVertical="top"
        />

        <Pressable style={styles.micBtn} onPress={onMicPress}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Ionicons
              name={recording ? "stop-circle" : "mic"}
              size={26}
              color={recording ? "red" : "black"}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  hint: { marginBottom: 10, fontSize: 12, color: "#444" },

  boxWrap: { position: "relative" },
  textArea: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    paddingRight: 60, // space for mic button
    backgroundColor: "white",
    fontSize: 16,
  },
  micBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});