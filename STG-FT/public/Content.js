console.log("STG AI content script loaded");

let lastUrl = "";

const checkSSL = () => window.location.protocol === "https:";

const detectPhishingForm = () => {
  const forms = document.querySelectorAll("form");
  for (let form of forms) {
    const action = form.action;
    if (action && !action.includes(window.location.hostname)) {
      return true;
    }
  }
  return false;
};

const showSTGBanner = (score, suggestion) => {
  const banner = document.createElement("div");

  banner.style.position = "fixed";
  banner.style.top = "10px";
  banner.style.left = "50%";
  banner.style.transform = "translateX(-50%)";
  banner.style.padding = "12px 20px";
  banner.style.zIndex = "999999";
  banner.style.borderRadius = "10px";
  banner.style.fontSize = "14px";
  banner.style.fontWeight = "bold";
  banner.style.color = "#fff";
  banner.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

  if (score === "SAFE") banner.style.backgroundColor = "#16a34a";
  else if (score === "CAUTION") banner.style.backgroundColor = "#f59e0b";
  else banner.style.backgroundColor = "#dc2626";

  banner.innerText = `🛡 STG AI: ${score} | ${suggestion}`;

  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 5000);
};

const sendToBackend = () => {
  const url = window.location.href;

  if (!url) return;

  const loginDetected = window.STGloginDetection?.() || false;
  const trackerCount = window.STGtrackerDetection?.() || 0;

  const https = checkSSL();
  const phishing = detectPhishingForm();

  console.log("Sending:", url);

  fetch("http://127.0.0.1:8000/api/trust/calculate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url,
      loginDetected,
      trackerCount,
      https,
      phishing
    })
  })
    .then((res) => {
      if (!res.ok) throw new Error("Backend error");
      return res.json();
    })
    .then((data) => {
      console.log("Backend:", data);

      chrome.storage.local.set({
        trustScore: data.trustScore,
        suggestion: data.suggestion,
        reasons: data.reasons,
        mlConfidence: data.mlConfidence
      });

      showSTGBanner(data.trustScore, data.suggestion);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
    });
};

setInterval(() => {
  const currentUrl = window.location.href;

  if (currentUrl && currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    sendToBackend();
  }
}, 1500);