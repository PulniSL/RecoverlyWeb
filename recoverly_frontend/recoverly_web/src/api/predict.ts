import { api } from "./client";

export type PredictResult = {
  prediction_id: number;
  most_impactful: string;
  top3: Array<{ label: string; score: number; level?: string | null }>;
  cleaned_text?: string;
};

export async function predict(text: string, user_id = "web_user"): Promise<PredictResult> {
  const res = await api.post("/predict", { text, user_id });
  return res.data as PredictResult;
}