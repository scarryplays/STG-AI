const trustScore = () => {
  chrome.storage.local.get(["loginDetected", "trackerCount"], (res) => {
    const login = res.loginDetected;
    const trackers = res.trackerCount || 0;

    let score = "NEUTRAL";

    if (login && trackers > 3) score = "RISK";
    else if (login && trackers > 0) score = "CAUTION";
    else if (login && trackers === 0) score = "SAFE";

    console.log("STG trust score:", score);

    chrome.storage.local.set({ trustScore: score });
  });
};

window.STGtrustScore = trustScore;