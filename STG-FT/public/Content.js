console.log("STG is running");

window.addEventListener("load", () => {
  setTimeout(() => {
    if (window.STGloginDetection) window.STGloginDetection();
    if (window.STGtrackerDetection) window.STGtrackerDetection();
  }, 1000);
});