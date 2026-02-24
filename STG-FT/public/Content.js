console.log("STG is running");

window.addEventListener("load", () => {
  if (window.STGloginDetection) {
    const detected = window.STGloginDetection();

    if (detected) {
      console.log("Login form detected on page load");
    }
  }
});