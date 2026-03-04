import { useEffect, useRef, useState } from "react";

type Props = {
  onText: (t: string) => void;
  disabled?: boolean;
};

export default function SpeechToText({ onText, disabled = false }: Props) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (e: any) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      onText(t.trim());
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recRef.current = rec;

    return () => {
      try { rec.stop(); } catch {}
      recRef.current = null;
    };
  }, [onText]);

  const toggle = () => {
    if (disabled) return;

    const rec = recRef.current;
    if (!rec) {
      alert("Speech-to-text not supported in this browser. Please type.");
      return;
    }
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      rec.start();
      setListening(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #ccc",
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        background: listening ? "#ef4444" : "white",
        color: listening ? "white" : "black",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {listening ? "Stop 🎤" : "Speak 🎤"}
    </button>
  );
}