const trackerDetection = () => {
  const scripts = document.querySelectorAll("script[src]");

  let trackerCount = 0;

  scripts.forEach((script) => {
    const src = script.src.toLowerCase();

    if (
      src.includes("analytics") ||
      src.includes("gtag") ||
      src.includes("facebook") ||
      src.includes("ads") ||
      src.includes("tracking")
    ) {
      trackerCount++;
    }
  });

  console.log("STG tracker count:", trackerCount);

  chrome.storage.local.set({ trackerCount });

  return trackerCount;
};

window.STGtrackerDetection = trackerDetection;