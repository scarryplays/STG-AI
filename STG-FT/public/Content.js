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
  })
  .catch((err) => {
    console.error("Fetch error:", err);
  });
      }, 1000);
});