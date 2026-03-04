import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { transcribeAudio } from "../api/stt";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function NarrativeInput({
  value,
  onChange,
  placeholder = "Type/paste your story here… or tap the mic and play audio near the phone.",
}: Props) {

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

      const result = await transcribeAudio(uri);
      const transcript = (result.text || "").trim();

      if (!transcript) {
        Alert.alert("No speech detected. Try again.");
        return;
      }

      onChange(value ? value + "\n" + transcript : transcript);

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
    <View style={styles.wrap}>

      <Text style={styles.hint}>
        Tap mic → play voice near phone → tap stop.
      </Text>

      <TextInput
        style={styles.textArea}
        multiline
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
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
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative", width: "100%" },
  hint: { marginBottom: 8, fontSize: 12, color: "#555" },
  textArea: {
    minHeight: 170,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    paddingRight: 56,
    fontSize: 16,
    backgroundColor: "white",
  },
  micBtn: {
    position: "absolute",
    right: 10,
    top: 36,
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