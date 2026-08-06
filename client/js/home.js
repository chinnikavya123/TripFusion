const menuButton=document.getElementById("menu-button");
const navigation=document.getElementById("nav-links");
const statusText=document.getElementById("server-status");
const statusDot=document.getElementById("status-dot");

menuButton?.addEventListener("click",()=>{
    navigation?.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link)=>{
    link.addEventListener("click",()=>{
        navigation?.classList.remove("active");
    });
});

async function checkBackendConnection(){
    if(!statusText||!statusDot){
        return;
    }

    statusText.textContent=
        "Connecting to TripFusion...";

    const controller=new AbortController();
    const timeoutId=setTimeout(
        ()=>controller.abort(),
        15000
    );

    try{
        const response=await fetch(
            `${API_BASE_URL}/health`,
            {
                signal:controller.signal,
                cache:"no-store"
            }
        );

        if(!response.ok){
            throw new Error(
                "Backend returned an error"
            );
        }

        const data=await response.json();

        statusText.textContent=
            data.message||
            "TripFusion backend is connected";

        statusDot.classList.add(
            "connected"
        );

        statusDot.classList.remove(
            "disconnected"
        );
    }catch(error){
        statusText.textContent=
            error.name==="AbortError"
                ?"Server is waking up. You can continue using the website and try again shortly."
                :"Unable to connect to the TripFusion backend";

        statusDot.classList.add(
            "disconnected"
        );

        statusDot.classList.remove(
            "connected"
        );

        console.error(
            "Backend connection error:",
            error
        );
    }finally{
        clearTimeout(timeoutId);
    }
}

checkBackendConnection();