console.log("STG is running");
    window.addEventListener("load",()=>{ 
        if(window.STGloginDetection()){
            window.STGloginDetection();
            console.log("Login form detected on page load");
        }
    })