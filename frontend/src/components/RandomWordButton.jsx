// feature used for testing

import { useState } from "react";

export default function RandomWordButton() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const getWord = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/randomWord");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { word } = await res.json();
      setWord(word);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
      <button onClick={getWord} disabled={loading}>
        {loading ? "Getting word…" : "testing get req"}
      </button>
      {err && <div style={{ color: "crimson" }}>Error: {err}</div>}
      {word && (
        <div>
          random word: <strong>{word}</strong>
        </div>
      )}
    </div>
  );
}
