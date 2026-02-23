 const loginDetection = () => {
    const passwordInputs = document.querySelector('input[type="password"]');
    const emailInputs = document.querySelector('input[type="email"]')||
    document.querySelector('input[name="email"]');
const usernameInputs = document.querySelector('input[name="username"]')||
document.querySelector('input[name="user"]')||
document.querySelector('input[name="login"]')||
document.querySelector('input[name="id"]');
if (passwordInputs && (emailInputs || usernameInputs)) {
    console.log("Login form detected");
    return true;
} else {
    console.log("No login form detected");
    return false;
}   
}


window.STGloginDetection = loginDetection;