const loginDetection = () => {
  const passwordInputs =
    document.querySelector('input[type="password"]') ||
    document.querySelector('input[name="password"]') ||
    document.querySelector('input[name="pass"]') ||
    document.querySelector('input[name="pwd"]') ||
    document.querySelector('input[name="txtPassword"]');

  const emailInputs =
    document.querySelector('input[type="email"]') ||
    document.querySelector('input[name="email"]') ||
    document.querySelector('input[name="user_email"]') ||
    document.querySelector('input[name="txtEmail"]');

  const usernameInputs =
    document.querySelector('input[name="username"]') ||
    document.querySelector('input[name="user"]') ||
    document.querySelector('input[name="login"]') ||
    document.querySelector('input[name="txtUserId"]') ||
    document.querySelector('input[name="id"]');

  const loginDetected = !!(passwordInputs && (emailInputs || usernameInputs));

  console.log("Login detected:", loginDetected);

  chrome.storage.local.set({ loginDetected });

  return loginDetected;
};

window.STGloginDetection = loginDetection;