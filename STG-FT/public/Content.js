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
}


const showSTGBanner = (score, reason) => {
  const banner = document.createElement("div");

  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.padding = "10px";
  banner.style.zIndex = "999999";
  banner.style.textAlign = "center";
  banner.style.fontSize = "16px";
  banner.style.fontWeight = "bold";
  banner.style.color = "#fff";

  if (score === "SAFE") {
    banner.style.backgroundColor = "green";
  } else if (score === "CAUTION") {
    banner.style.backgroundColor = "orange";
  } else {
    banner.style.backgroundColor = "red";
  }

  banner.innerText = `STG AI WARNING: ${score} - ${reason}`;

  document.body.appendChild(banner);
};


window.addEventListener("load", () => {

  setTimeout(() => {

    const loginDetected = window.STGloginDetection();
    const trackerCount = window.STGtrackerDetection();
    const domain = window.location.hostname.replace("www.", "");

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
        reason: data.reason
      });

      if (
        data.trustScore === "SAFE" ||
        data.trustScore === "CAUTION" ||
        data.trustScore === "RISK"
      ) {
        showSTGBanner(data.trustScore, data.reason);
      }

    })
    .catch((err) => {
      console.error("Fetch error:", err);
    });

  }, 1000);

});