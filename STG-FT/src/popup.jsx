import { useEffect, useState } from "react";

function Popup() {
  const [domain, setDomain] = useState("");
  const [loginDetected, setLoginDetected] = useState(false);
  const [trustScore, setTrustScore] = useState("NEUTRAL");

  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.tabs) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].url) return;
      const url = new URL(tabs[0].url);
      setDomain(url.hostname);
    });
  }, []);

  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage) return;

    chrome.storage.local.get(["loginDetected"], (res) => {
      setLoginDetected(!!res.loginDetected);
    });
  }, []);

  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage) return;

    chrome.storage.local.get(["trustScore"], (res) => {
      if (res.trustScore) setTrustScore(res.trustScore);
    });
  }, []);

  const renderTrust = () => {
    if (trustScore === "SAFE") return <span style={{ color: "green" }}>SAFE 🟢</span>;
    if (trustScore === "CAUTION") return <span style={{ color: "orange" }}>CAUTION 🟡</span>;
    if (trustScore === "RISK") return <span style={{ color: "red" }}>RISK 🔴</span>;
    return <span>NEUTRAL ⚪</span>;
  };

  return (
    <div style={{ padding: 16, width: 280, fontFamily: "sans-serif" }}>
      <h2>STG AI</h2>

      {loginDetected && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Login form detected ⚠️
        </p>
      )}

      <p>Trust: {renderTrust()}</p>
      {/* <p>{reason} reason</p> */}
{/* for git? */}
      <strong>{domain}</strong>
    </div>
  );
}


export default Popup;