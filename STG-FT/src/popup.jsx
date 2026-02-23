import { useEffect, useState } from "react";

function Popup() {
  const [domain, setDomain] = useState("");
  const [loginDetected, setLoginDetected] = useState(false);

  useEffect(() => {
    if (!chrome?.tabs?.query) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]?.url) return;

      const url = new URL(tabs[0].url);
      setDomain(url.hostname);
    });
  }, []);

  // message listener
useEffect(() => {
  if (!chrome?.storage?.local) return;

  chrome.storage.local.get(["loginDetection "], (res) => {
    if (res.loginDetected) {
      setLoginDetected(true);
    }
  });
}, []);

  return (
    <div style={{ padding: 16, width: 280 }}>
      <h2>STG AI</h2>

      {loginDetected ? (
        <p style={{ color: "red" }}>Login detected ⚠️</p>
      ) : (
        <p>Analyzing trust…</p>
      )}

      <strong>{domain}</strong>
    </div>
  );
}

export default Popup;