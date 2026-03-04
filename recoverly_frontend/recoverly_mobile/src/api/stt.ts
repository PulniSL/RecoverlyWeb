import axios from "axios";
import { api } from "./client";

export async function transcribeAudio(
  uri: string,
  filename = "dictation.m4a",
  mimeType = "audio/m4a"
): Promise<{ text: string; language?: string }> {

  const form = new FormData();

  form.append("file", {
    uri,
    name: filename,
    type: mimeType,
  } as any);

  const baseURL = api.defaults.baseURL?.replace(/\/$/, "") || "";

  const res = await axios.post(
    `${baseURL}/stt/transcribe`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 10 * 60 * 1000,
    }
  );

  return {
    text: res.data?.text || "",
    language: res.data?.language,
  };
}