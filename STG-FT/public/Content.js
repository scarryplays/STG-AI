console.log("STG AI content script loaded");

const checkSSL = () => {
  return window.location.protocol === "https:";
};

const detectPhishingForm = () => {
  const forms = document.querySelectorAll("form");

  for (let form of forms) {
    const action = form.action;
    if (action && !action.includes(window.location.hostname)) {
      console.log("STG: suspicious external login form detected");
      return true;
    }
  }

  return false;
};

const showSTGBanner = (score, suggestion) => {
// asadadad
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

  setTimeout(() => {
    banner.remove();
  }, 5000);
};

// clkanvksjvbskj bskljbcslkj lskjn kl.s vck.s lks klsj lks vlkj lk.jb s

window.addEventListener("load", () => {
  setTimeout(() => {
    const loginDetected = window.STGloginDetection();
    const trackerCount = window.STGtrackerDetection();
    const domain = window.location.href;
    const https = checkSSL();
    const phishing = detectPhishingForm();

    console.log("Sending to backend:", {
      domain,
      loginDetected,
      trackerCount,
      https,
      phishing
    });

    fetch("http://127.0.0.1:8000/api/trust/calculate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        domain,
        loginDetected,
        trackerCount,
        https,
        phishing
      })
    })
      .then((res) => {
        console.log("Raw response:", res);
        console.log("Status:", res.status);

        if (!res.ok) {
          throw new Error(`backend error! status: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        console.log("Backend response:", data);

        chrome.storage.local.set({
          trustScore: data.trustScore,
          suggestion: data.suggestion,
          reasons: data.reasons,
          ml_confidence: data.ml_confidence
        });

        if (
          data.trustScore === "SAFE" ||
          data.trustScore === "CAUTION" ||
          data.trustScore === "RISK"
        ) {
          showSTGBanner(data.trustScore, data.suggestion);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, 1000);
});
