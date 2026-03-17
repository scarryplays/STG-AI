import { useEffect, useState } from "react";

function Popup() {
  const [domain, setDomain] = useState("");
  const [loginDetected, setLoginDetected] = useState(false);
  const [trustScore, setTrustScore] = useState("NEUTRAL");
  const [suggestion, setSuggestion] = useState("");
  const [reasons, setReasons] = useState([]);
  const [ml_confidence, setMlConfidence] = useState(0);

  useEffect(() => {
    if (!chrome?.tabs) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs?.[0]?.url) return;
      const url = new URL(tabs[0].url);
      setDomain(url.hostname);
    });
  }, []);

  useEffect(() => {
    if (!chrome?.storage) return;

    chrome.storage.local.get(
      ["loginDetected", "trustScore", "suggestion", "reasons", "ml_confidence"],
      (res) => {
        setLoginDetected(!!res.loginDetected);
        setTrustScore(res.trustScore || "NEUTRAL");
        setSuggestion(res.suggestion || "");
        setReasons(res.reasons || []);
        setMlConfidence(res.ml_confidence || 0);
      }
    );
  }, []);
  console.log("let see the error",suggestion,ml_confidence );
  

  const getColor = () => {
    if (trustScore === "SAFE") return "#16a34a";
    if (trustScore === "CAUTION") return "#f59e0b";
    if (trustScore === "RISK") return "#dc2626";
    return "#6b7280";
  };

  return (
    <div style={{ padding: 16, width: 300, fontFamily: "sans-serif" }}>
      <h2>♥ STG AI ♥</h2>

      <p style={{ fontSize: 12, color: "#3b38de" }}>{domain}</p>

      {loginDetected && (
        <p style={{ color: "#dc2626", fontWeight: "bold" }}>
          Login form detected ⚠️
        </p>
      )}

      <div
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 8,
          background: "#f9fafb",
        }}
      >
        <p style={{ color: getColor(), fontWeight: "bold", fontSize: 16 }}>
          Risk: {trustScore}
        </p>

        <p style={{ fontSize: 13,color: "#000000" }}>
          <strong> AI Suggestion:</strong> {suggestion}
        </p>

        <div style={{ marginTop: 10 }}>
          <div
            style={{
              height: 8,
              background: "#e5e7eb",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${ml_confidence}%`,
                height: "100%",
                background: getColor(),
              }}
            ></div>
          </div>
          <p style={{ fontSize: 12, marginTop: 5, color: "#000000" }}>
            AI Confidence: {ml_confidence}%
          </p>
        </div>

        <ul style={{ marginTop: 10, paddingLeft: 15 }}>
          {reasons.map((r, i) => (
            <li key={i} style={{ fontSize: 12, color: "#000000" }}>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Popup;
