const loginDetection = () => {
    console.log("Login detection file loaded");
  const passwordInputs =
    document.querySelector('input[type="password"]') ||
    document.querySelector('input[name="password"]') ||
    document.querySelector('input[name="pass"]') ||
    document.querySelector('input[name="pwd"]') ||
    document.querySelector('input[id="txtPassword"]') ||
    document.querySelector('input[name="txtPassword"]');

    const usernameOrEmailInputs =
    document.querySelector('input[name="username_or_email:"]')||
    document.querySelector('input[name="usernameOrEmail"]') ||
    document.querySelector('input[id="username_or_email"]') ||
    document.querySelector('input[name="user_email"]');

  const emailInputs =
    document.querySelector('input[type="email"]') ||
    document.querySelector('input[id="email"]') ||
    document.querySelector('input[name="email"]') ||
    document.querySelector('input[name="user_email"]') ||
    document.querySelector('input[name="txtEmail"]');
    const domain = window.location.hostname;
      console.log("domain check", domain);
      

  const usernameInputs =
    document.querySelector('input[name="username"]') ||
    document.querySelector('input[id="username"]') ||
    document.querySelector('input[name="user"]') ||
    document.querySelector('input[name="login"]') ||
    document.querySelector('input[name="txtUserId"]') ||
    document.querySelector('input[name="id"]');
    

  const loginDetected = !!(passwordInputs ||emailInputs || usernameInputs||usernameOrEmailInputs);

  console.log("Login detected:", loginDetected);

  chrome.storage.local.set({ loginDetected }) , ()=>{
    console.log("Login detection result saved to storage:", loginDetected);
  };
   if (loginDetected) {
  chrome.storage.local.set({ loginDetected: true });
}
  return loginDetected;
};

window.STGloginDetection = loginDetection;