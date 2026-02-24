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


  useEffect(() => {
    if (!chrome?.storage?.local) return;

    chrome.storage.local.get(["loginDetected"], (res) => {
      console.log("Popup storage:", res);

      if (res.loginDetected) {
        setLoginDetected(true);
      } else {
        setLoginDetected(false);
      }
    });
  }, []);

  return (
    <div style={{ padding: 16, width: 280 }}>
      <h2>STG AI</h2>

      {loginDetected ? (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Login form detected ⚠️
        </p>
      ) : (
        <p>Analyzing trust…</p>
      )}

      <strong>{domain}</strong>
    </div>
  );
}

export default Popup;