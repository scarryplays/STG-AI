window.addEventListener("load", () => {
  setTimeout(() => {
    const loginDetected = window.STGloginDetection();
    const trackerCount = window.STGtrackerDetection();
    const domain = window.location.hostname;
    console.log("Sending to backend:", {
  domain,
  loginDetected,
  trackerCount,
});
const showSTGBanner = (score, reason) => {
  const banner = document.createElement("div");
  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";  
  banner.style.width = "100%";
  banner.style.padding = "10px";
  banner.style.zIndex = "9999";
  banner.style.textAlign = "center";
  banner.style.fontSize = "16px";
  banner.style.fontWeight = "bold";
  banner.style.color = "#fff";
  banner.style.backgroundColor = score === "SAFE" ? "green" : score === "CAUTION" ? "orange" : "red";
  banner.innerText = `STG AI WARNING: ${score} - ${reason}`;
  document.body.appendChild(banner);
}









fetch("http://127.0.0.1:8000/api/trust/calculate/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    domain,
    loginDetected,
    trackerCount,
  }),
})
  .then((res) => {
    console.log(" Raw response:", res);
    console.log(" Status:", res.status);
    return res.json();
  })
  .then((data) => {
    console.log(" Backend response:", data);

    chrome.storage.local.set({
      trustScore: data.trustScore,
      reason: data.reason,
    });
    if(data.trustScore === "SAFE"||data.trustScore === "CAUTION"||data.trustScore === "RISK"){
    showSTGBanner(data.trustScore, data.reason);
  }
  })
  .catch((err) => {
    console.error("Fetch error:", err);
  });
      }, 1000);
});